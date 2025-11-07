"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { updateAddress } from "@/actions/address.actions"
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
    FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AddressDTO as addressSchema, type AddressDTO as AddressFormValues } from "@/dtos/addressDTO"
import { AddressDomain } from "@/app/domain/addressDomain"
import { Pencil } from "lucide-react"

interface EditAddressDialogProps {
    address: AddressDomain
}

const formatZipCode = (value: string | null | undefined) => {
    const digits = value?.replace(/\D/g, "").slice(0, 8) ?? ""
    if (!digits) {
        return ""
    }
    return digits.replace(/(\d{5})(\d{0,3})/, (_, p1: string, p2: string) => (p2 ? `${p1}-${p2}` : p1))
}

export function EditAddressDialog({ address }: EditAddressDialogProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [isFetchingCep, setIsFetchingCep] = useState(false)
    const lastFetchedCepRef = useRef<string | null>(null)

    const defaultValues = useMemo<AddressFormValues>(() => ({
        name: address.name ?? "",
        street: address.street ?? "",
        number: address.number ?? "",
        neighborhood: address.neighborhood ?? "",
        city: address.city ?? "",
        state: address.state ?? "",
        zipCode: formatZipCode(address.zipCode),
        complement: address.complement ?? "",
        isFavorite: address.isFavorite ?? false,
        isActive: address.isActive ?? true,
    }), [address])

    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues,
    })

    useEffect(() => {
        form.reset(defaultValues)
        lastFetchedCepRef.current = null
    }, [defaultValues, form])

    const zipCodeValue = form.watch("zipCode")

    useEffect(() => {
        const sanitizedCep = zipCodeValue?.replace(/\D/g, "") ?? ""

        if (sanitizedCep.length !== 8 || sanitizedCep === lastFetchedCepRef.current) {
            if (sanitizedCep.length < 8) {
                form.clearErrors("zipCode")
            }
            return
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
        form.clearErrors()
        if (!nextOpen) {
            form.reset(defaultValues)
            lastFetchedCepRef.current = null
            setIsFetchingCep(false)
        } else {
            form.reset(defaultValues)
            lastFetchedCepRef.current = null
        }
    }

    const onSubmit = (values: AddressFormValues) => {
        startTransition(async () => {
            try {
                await updateAddress(address.id, {
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
                })

                toast.success("Endereço atualizado com sucesso")
                router.refresh()
                handleOpenChange(false)
            } catch (error) {
                const message =
                    error instanceof Error ? error.message : "Erro ao atualizar endereço"

                form.setError("root", { message })
                toast.error(message)
            }
        })
    }

    return (
        <Form {...form}>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon_xs"
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <Pencil size={14} />
                        <span className="sr-only">Editar endereço</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>Editar endereço</DialogTitle>
                        <DialogDescription>
                            Atualize as informações necessárias e salve para aplicar as mudanças.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
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
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
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
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
                                        <FormControl>
                                            <Input placeholder="SP" maxLength={2} {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="zipCode"
                                render={({ field }) => (
                                    <FormItem>
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
                        </div>
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
                                        : "Salvar alterações"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Form>
    )
}

