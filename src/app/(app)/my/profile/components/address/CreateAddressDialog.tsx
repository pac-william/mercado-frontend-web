"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { createAddress } from "@/actions/address.actions"
import GoogleMaps from "@/app/components/GoogleMaps"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AddressDTO as addressSchema, type AddressDTO as AddressFormValues } from "@/dtos/addressDTO"
import { Plus } from "lucide-react"

export function CreateAddressDialog({ addressesCount }: { addressesCount: number }) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [isFetchingCep, setIsFetchingCep] = useState(false)
    const lastFetchedCepRef = useRef<string | null>(null)

    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            name: "",
            street: "",
            number: "",
            neighborhood: "",
            city: "",
            state: "",
            zipCode: "",
            complement: "",
            isFavorite: false,
            isActive: true,
            latitude: undefined,
            longitude: undefined,
        },
    })

    const zipCodeValue = form.watch("zipCode")
    const latitudeValue = form.watch("latitude")
    const longitudeValue = form.watch("longitude")
    const hasLocation = latitudeValue !== undefined && latitudeValue !== null &&
        longitudeValue !== undefined && longitudeValue !== null

    useEffect(() => {
        const sanitizedCep = zipCodeValue?.replace(/\D/g, "") ?? ""

        if (sanitizedCep.length !== 8 || sanitizedCep === lastFetchedCepRef.current) {
            if (sanitizedCep.length < 8) {
                form.clearErrors("zipCode")
                form.setValue("latitude", undefined, {
                    shouldDirty: false,
                    shouldTouch: false,
                    shouldValidate: false,
                })
                form.setValue("longitude", undefined, {
                    shouldDirty: false,
                    shouldTouch: false,
                    shouldValidate: false,
                })
            }
            return
        }

        const fetchCoordinates = async (cep: string) => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?postalcode=${cep}&country=Brazil&format=json`,
                    {
                        headers: {
                            "Accept": "application/json",
                        },
                    },
                )
                if (!response.ok) {
                    return
                }

                const data: Array<{ lat: string; lon: string }> = await response.json()
                if (!Array.isArray(data) || data.length === 0) {
                    return
                }

                const { lat, lon } = data[0]
                const latitude = Number.parseFloat(lat)
                const longitude = Number.parseFloat(lon)

                if (!Number.isNaN(latitude) && !Number.isNaN(longitude)) {
                    form.setValue("latitude", latitude, { shouldDirty: true, shouldValidate: true })
                    form.setValue("longitude", longitude, { shouldDirty: true, shouldValidate: true })
                }
            } catch (error) {
                console.error("Erro ao buscar coordenadas do CEP:", error)
            }
        }

        const fetchCep = async () => {
            setIsFetchingCep(true)
            try {
                const response = await fetch(`https://viacep.com.br/ws/${sanitizedCep}/json/`)
                if (!response.ok) {
                    throw new Error("Não foi possível buscar o CEP")
                }

                const data: {
                    erro?: boolean
                    logradouro?: string
                    bairro?: string
                    localidade?: string
                    uf?: string
                    complemento?: string
                } = await response.json()

                if (data.erro) {
                    const message = "CEP não encontrado"
                    form.setError("zipCode", { message })
                    toast.error(message)
                    return
                }

                const currentZip = form.getValues("zipCode").replace(/\D/g, "")
                if (currentZip !== sanitizedCep) {
                    return
                }

                form.clearErrors("zipCode")
                lastFetchedCepRef.current = sanitizedCep

                if (data.logradouro) {
                    form.setValue("street", data.logradouro, { shouldDirty: true })
                }
                if (data.bairro) {
                    form.setValue("neighborhood", data.bairro, { shouldDirty: true })
                }
                if (data.localidade) {
                    form.setValue("city", data.localidade, { shouldDirty: true })
                }
                if (data.uf) {
                    form.setValue("state", data.uf, { shouldDirty: true })
                }
                if (data.complemento) {
                    form.setValue("complement", data.complemento, { shouldDirty: true })
                }

                await fetchCoordinates(sanitizedCep)
            } catch (error) {
                const message =
                    error instanceof Error ? error.message : "Erro ao consultar CEP"
                form.setError("zipCode", { message })
                toast.error(message)
            } finally {
                setIsFetchingCep(false)
            }
        }

        fetchCep()
    }, [zipCodeValue, form])

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen)
        if (!nextOpen) {
            form.reset()
            form.clearErrors()
            lastFetchedCepRef.current = null
            setIsFetchingCep(false)
        }
    }

    const handleLocationChange = (coordinates: { latitude: number; longitude: number }) => {
        form.setValue("latitude", coordinates.latitude, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
        form.setValue("longitude", coordinates.longitude, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
    }

    const onSubmit = (values: AddressFormValues) => {
        startTransition(async () => {
            try {
                await createAddress({
                    ...values,
                    name: values.name.trim(),
                    street: values.street.trim(),
                    number: values.number.trim(),
                    neighborhood: values.neighborhood.trim(),
                    city: values.city.trim(),
                    state: values.state.trim(),
                    zipCode: values.zipCode.trim(),
                    complement: values.complement?.trim() || undefined,
                    isFavorite: values.isFavorite ?? false,
                    isActive: values.isActive ?? true,
                    latitude: values.latitude ?? undefined,
                    longitude: values.longitude ?? undefined,
                })

                toast.success("Endereço cadastrado com sucesso")
                router.refresh()
                handleOpenChange(false)
            } catch (error) {
                const message =
                    error instanceof Error ? error.message : "Erro ao criar endereço"

                form.setError("root", { message })
                toast.error(message)
            }
        })
    }

    return (
        <Form {...form}>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    <Button variant="outline" disabled={addressesCount >= 3}>
                        <Plus size={16} />
                        Adicionar endereço
                    </Button>
                </DialogTrigger>
                <DialogContent className="flex flex-col flex-1 sm:max-w-[520px] h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Novo endereço</DialogTitle>
                        <DialogDescription>
                            Preencha as informações abaixo para cadastrar um novo endereço de entrega.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="flex flex-col flex-grow h-0 overflow-y-auto pr-4">
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="zipCode"
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-2">
                                            <FormLabel>CEP</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="00000-000"
                                                    {...field}
                                                    value={field.value}
                                                    onChange={(event) => {
                                                        const digitsOnly = event.target.value
                                                            .replace(/\D/g, "")
                                                            .slice(0, 8)
                                                        const formatted = digitsOnly.replace(
                                                            /(\d{5})(\d{0,3})/,
                                                            (_, p1: string, p2: string) =>
                                                                p2 ? `${p1}-${p2}` : p1,
                                                        )
                                                        lastFetchedCepRef.current = null
                                                        field.onChange(formatted)
                                                    }}
                                                    onBlur={(event) => {
                                                        field.onBlur()
                                                        const digitsOnly = event.target.value.replace(/\D/g, "")
                                                        if (digitsOnly.length !== 8) {
                                                            form.setError("zipCode", {
                                                                message: "Informe um CEP válido com 8 dígitos",
                                                            })
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-2">
                                            <FormLabel>Identificação do endereço</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Casa" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="street"
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-2">
                                            <FormLabel>Rua</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Rua das Flores" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Número</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="complement"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Complemento (opcional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Apto 101" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="neighborhood"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bairro</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Centro" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <div className="grid sm:grid-cols-3 gap-4 sm:col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem className="sm:col-span-2">
                                                <FormLabel>Cidade</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="São Paulo" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="state"
                                        render={({ field }) => (
                                            <FormItem className="sm:col-span-1">
                                                <FormLabel>Estado</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="SP" maxLength={2} {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="latitude"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Latitude</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    readOnly
                                                    placeholder="Selecione no mapa"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="longitude"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Longitude</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    readOnly
                                                    placeholder="Selecione no mapa"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <GoogleMaps
                                latitude={latitudeValue}
                                longitude={longitudeValue}
                                height="260px"
                                zoom={hasLocation ? 16 : 12}
                                onLocationChange={handleLocationChange}
                            />
                            {form.formState.errors.root?.message ? (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.root.message}
                                </p>
                            ) : null}
                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleOpenChange(false)}
                                        disabled={isPending}
                                    >
                                        Cancelar
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={isPending || isFetchingCep}>
                                    {isPending
                                        ? "Salvando..."
                                        : isFetchingCep
                                            ? "Consultando CEP..."
                                            : "Salvar endereço"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </Form>
    )
}
