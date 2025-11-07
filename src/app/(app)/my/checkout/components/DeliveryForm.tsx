"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState, useTransition } from "react"
import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { createAddress, updateAddress } from "@/actions/address.actions"
import { AddressDomain } from "@/app/domain/addressDomain"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { AddressDTO as addressSchema } from "@/dtos/addressDTO"

const baseAddressSchema = addressSchema.pick({
    name: true,
    street: true,
    number: true,
    neighborhood: true,
    city: true,
    state: true,
    zipCode: true,
    complement: true,
})

const deliveryFormSchema = baseAddressSchema.extend({
    selectedAddressId: z.string().min(1, { message: "Selecione um endereço" }).optional(),
    rememberData: z.enum(["existing", "new"]),
})

type DeliveryFormValues = z.infer<typeof deliveryFormSchema>

interface DeliveryFormProps {
    addresses: AddressDomain[]
    selectedAddressId?: string
    onAddressSelected?: (addressId: string | undefined) => void
}

const buildValuesFromAddress = (
    address: AddressDomain | null | undefined,
    mode: DeliveryFormValues["rememberData"],
): DeliveryFormValues => ({
    name: address?.name ?? "",
    street: address?.street ?? "",
    number: address?.number ?? "",
    neighborhood: address?.neighborhood ?? "",
    city: address?.city ?? "",
    state: address?.state ?? "",
    zipCode: address?.zipCode ?? "",
    complement: address?.complement ?? "",
    rememberData: mode,
    selectedAddressId: mode === "existing" ? address?.id : undefined,
})

export default function DeliveryForm({ addresses, selectedAddressId: externalSelectedAddressId, onAddressSelected }: DeliveryFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const defaultAddress = useMemo(
        () => addresses.find((address) => address.isFavorite) ?? addresses[0],
        [addresses],
    )

    const defaultMode = addresses.length ? "existing" : "new"

    const initialValues = useMemo(
        () => buildValuesFromAddress(defaultMode === "existing" ? defaultAddress : null, defaultMode),
        [defaultAddress, defaultMode],
    )

    const form = useForm<DeliveryFormValues>({
        resolver: zodResolver(deliveryFormSchema),
        defaultValues: initialValues,
    })

    const [mode, setMode] = useState<DeliveryFormValues["rememberData"]>(initialValues.rememberData)

    useEffect(() => {
        form.reset(initialValues)
        setMode(initialValues.rememberData)
        if (initialValues.rememberData === "existing") {
            onAddressSelected?.(initialValues.selectedAddressId)
        }
    }, [initialValues, form, onAddressSelected])

    useEffect(() => {
        if (externalSelectedAddressId && mode === "existing") {
            form.setValue("selectedAddressId", externalSelectedAddressId)
        }
    }, [externalSelectedAddressId, form, mode])

    const selectedAddressId = form.watch("selectedAddressId")

    const selectedAddress = useMemo(() => {
        if (mode !== "existing") {
            return null
        }
        if (!selectedAddressId) {
            return defaultAddress ?? null
        }
        return addresses.find((address) => address.id === selectedAddressId) ?? null
    }, [addresses, selectedAddressId, mode, defaultAddress])

    useEffect(() => {
        if (mode === "existing") {
            const addressToApply = selectedAddress ?? defaultAddress ?? null
            form.reset(buildValuesFromAddress(addressToApply, "existing"), {
                keepDefaultValues: true,
            })
            return
        }

        form.reset(buildValuesFromAddress(null, "new"), {
            keepDefaultValues: true,
        })
    }, [mode, selectedAddress, defaultAddress, form])

    const onSubmit: SubmitHandler<DeliveryFormValues> = (values) => {
        const addressId = values.selectedAddressId

        if (mode === "existing" && addressId) {
            startTransition(async () => {
                try {
                    await updateAddress(addressId, {
                        name: values.name.trim(),
                        street: values.street.trim(),
                        number: values.number.trim(),
                        neighborhood: values.neighborhood.trim(),
                        city: values.city.trim(),
                        state: values.state.trim(),
                        zipCode: values.zipCode.trim(),
                        complement: values.complement?.trim() || undefined,
                    })
                    toast.success("Endereço atualizado para entrega")
                    onAddressSelected?.(addressId)
                    router.refresh()
                } catch (error) {
                    const message =
                        error instanceof Error ? error.message : "Erro ao atualizar endereço"
                    toast.error(message)
                }
            })
            return
        }

        startTransition(async () => {
            try {
                const newAddress = await createAddress({
                    name: values.name.trim(),
                    street: values.street.trim(),
                    number: values.number.trim(),
                    neighborhood: values.neighborhood.trim(),
                    city: values.city.trim(),
                    state: values.state.trim(),
                    zipCode: values.zipCode.trim(),
                    complement: values.complement?.trim() || undefined,
                    isFavorite: false,
                    isActive: true,
                })

                toast.success("Endereço criado com sucesso")
                setMode("existing")
                form.reset(buildValuesFromAddress(newAddress, "existing"), {
                    keepDefaultValues: true,
                })
                form.setValue("selectedAddressId", newAddress.id)
                onAddressSelected?.(newAddress.id)
                router.refresh()
            } catch (error) {
                const message =
                    error instanceof Error ? error.message : "Erro ao salvar endereço"
                toast.error(message)
            }
        })
    }

    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="text-lg text-card-foreground">Entrega</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4">
                                {addresses.length ? (
                                    <FormField
                                        control={form.control}
                                        name="rememberData"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm text-muted-foreground">
                                                    Escolha como deseja preencher os dados de entrega
                                                </FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={(value) => {
                                                            field.onChange(value)
                                                            const nextMode = value as "existing" | "new"
                                                            setMode(nextMode)
                                                            if (nextMode === "new") {
                                                                form.setValue("selectedAddressId", undefined)
                                                                onAddressSelected?.(undefined)
                                                            } else {
                                                                const nextAddress = selectedAddress ?? defaultAddress
                                                                const nextId = nextAddress?.id
                                                                form.setValue("selectedAddressId", nextId)
                                                                onAddressSelected?.(nextId)
                                                            }
                                                        }}
                                                        value={field.value}
                                                        className="grid gap-2"
                                                    >
                                                        <FormItem className="flex items-center gap-3 rounded-lg border p-3">
                                                            <FormControl>
                                                                <RadioGroupItem value="existing" />
                                                            </FormControl>
                                                            <div className="space-y-1">
                                                                <FormLabel className="text-base">
                                                                    Usar endereço existente
                                                                </FormLabel>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Escolha um dos seus endereços cadastrados e atualize os detalhes, se necessário.
                                                                </p>
                                                            </div>
                                                        </FormItem>
                                                        <FormItem className="flex items-center gap-3 rounded-lg border p-3">
                                                            <FormControl>
                                                                <RadioGroupItem value="new" />
                                                            </FormControl>
                                                            <div className="space-y-1">
                                                                <FormLabel className="text-base">
                                                                    Informar novo endereço
                                                                </FormLabel>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Digite manualmente os detalhes de entrega para este pedido.
                                                                </p>
                                                            </div>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                ) : null}

                                {mode === "existing" && addresses.length ? (
                                    <Controller
                                        control={form.control}
                                        name="selectedAddressId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Selecione o endereço</FormLabel>
                                                    <Select
                                                        onValueChange={(value) => {
                                                            field.onChange(value)
                                                            onAddressSelected?.(value)
                                                        }}
                                                        value={field.value ?? undefined}
                                                    >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Selecione um endereço" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {addresses.map((address) => (
                                                            <SelectItem key={address.id} value={address.id}>
                                                                {address.name} - {address.street}, {address.number}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ) : null}
                            </div>

                            {mode === "existing" && !selectedAddress ? (
                                <p className="text-sm text-muted-foreground">
                                    Selecione um endereço para visualizar e editar os detalhes.
                                </p>
                            ) : null}

                            {mode === "new" || selectedAddress ? (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="sm:col-span-2">
                                                <FormLabel>Identificação</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Casa" {...field} />
                                                </FormControl>
                                                <FormMessage />
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
                                                <FormMessage />
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
                                                <FormMessage />
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
                                                <FormMessage />
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
                                                <FormMessage />
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
                                                <FormMessage />
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
                                                <FormMessage />
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
                                                    <Input placeholder="00000-000" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            ) : null}

                            <Separator />

                            <CardFooter className="px-0">
                                <div className="ml-auto flex items-center gap-3">
                                    <Button
                                        type="submit"
                                        disabled={isPending || (mode === "existing" && !selectedAddress)}
                                    >
                                        {isPending ? "Salvando..." : "Salvar endereço de entrega"}
                                    </Button>
                                </div>
                            </CardFooter>
                        </form>
                    </Form>
                </div>
            </CardContent>
        </Card>
    )
}

