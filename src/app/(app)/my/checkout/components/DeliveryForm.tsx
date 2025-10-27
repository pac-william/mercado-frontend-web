'use client';

import { getAddresses } from "@/actions/address.actions";
import { AddressResponseDTO } from "@/dtos/addressDTO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MapPin, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const deliverySchema = z.object({
    addressId: z.string().optional(),
    street: z.string().min(3, "Rua deve ter pelo menos 3 caracteres"),
    number: z.string().min(1, "Número é obrigatório"),
    complement: z.string().optional(),
    neighborhood: z.string().min(3, "Bairro deve ter pelo menos 3 caracteres"),
    city: z.string().min(3, "Cidade deve ter pelo menos 3 caracteres"),
    state: z.string().length(2, "Estado deve ter 2 caracteres (ex: MG)"),
    zipCode: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido (ex: 12345-678)"),
});

export type DeliveryFormData = z.infer<typeof deliverySchema>;

interface DeliveryFormProps {
    onSubmit: (data: DeliveryFormData) => void;
    isLoading?: boolean;
}

export default function DeliveryForm({ onSubmit, isLoading }: DeliveryFormProps) {
    const [addresses, setAddresses] = useState<AddressResponseDTO[]>([]);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("");
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [isLoadingCep, setIsLoadingCep] = useState(false);

    const form = useForm<DeliveryFormData>({
        resolver: zodResolver(deliverySchema),
        defaultValues: {
            addressId: "",
            street: "",
            number: "",
            complement: "",
            neighborhood: "",
            city: "",
            state: "",
            zipCode: "",
        },
    });

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        setIsLoadingAddresses(true);
        try {
            const data = await getAddresses();
            setAddresses(data.addresses);
            
            // Select favorite address by default
            const favoriteAddress = data.addresses.find(addr => addr.isFavorite);
            if (favoriteAddress) {
                handleSelectAddress(favoriteAddress.id);
            }
        } catch (error) {
            console.error("Erro ao carregar endereços:", error);
            toast.error("Erro ao carregar endereços");
            setShowNewAddressForm(true);
        } finally {
            setIsLoadingAddresses(false);
        }
    };

    const handleSelectAddress = (addressId: string) => {
        setSelectedAddressId(addressId);
        const address = addresses.find(a => a.id === addressId);
        
        if (address) {
            form.setValue("addressId", addressId);
            form.setValue("street", address.street);
            form.setValue("number", address.number);
            form.setValue("complement", address.complement || "");
            form.setValue("neighborhood", address.neighborhood);
            form.setValue("city", address.city);
            form.setValue("state", address.state);
            form.setValue("zipCode", address.zipCode);
        }
        
        setShowNewAddressForm(false);
    };

    const handleUseNewAddress = () => {
        setSelectedAddressId("");
        form.setValue("addressId", "");
        form.reset({
            street: "",
            number: "",
            complement: "",
            neighborhood: "",
            city: "",
            state: "",
            zipCode: "",
        });
        setShowNewAddressForm(true);
    };

    const handleSearchCep = async () => {
        const zipCode = form.getValues("zipCode");
        
        if (!zipCode) {
            toast.error("Digite um CEP");
            return;
        }

        const cleanCep = zipCode.replace(/\D/g, "");

        if (cleanCep.length !== 8) {
            toast.error("CEP deve ter 8 dígitos");
            return;
        }

        setIsLoadingCep(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();

            if (data.erro) {
                toast.error("CEP não encontrado");
            } else {
                form.setValue("street", data.logradouro || "");
                form.setValue("neighborhood", data.bairro || "");
                form.setValue("city", data.localidade || "");
                form.setValue("state", data.uf || "");
                form.setValue("complement", data.complemento || "");
                toast.success("Endereço encontrado!");
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            toast.error("Erro ao buscar endereço");
        } finally {
            setIsLoadingCep(false);
        }
    };

    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="text-card-foreground">Endereço de Entrega</CardTitle>
                <CardDescription className="text-muted-foreground">
                    Selecione um endereço cadastrado ou adicione um novo
                </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 space-y-6">
                {!showNewAddressForm && (
                    <div className="space-y-4">
                        {isLoadingAddresses ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                        ) : addresses.length > 0 ? (
                            <div className="space-y-3">
                                {addresses.map((address) => (
                                    <label
                                        key={address.id}
                                        className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                                            selectedAddressId === address.id
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="address"
                                            value={address.id}
                                            checked={selectedAddressId === address.id}
                                            onChange={() => handleSelectAddress(address.id)}
                                            className="mt-1"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium">{address.name}</span>
                                                {address.isFavorite && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        Favorito
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {address.street}, {address.number}
                                                {address.complement && ` - ${address.complement}`}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {address.neighborhood} - {address.city}/{address.state}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                CEP: {address.zipCode}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        ) : null}

                        <div className="flex gap-2">
                            {addresses.length > 0 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleUseNewAddress}
                                    disabled={isLoading}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Usar Novo Endereço
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {showNewAddressForm && (
                    <div className="space-y-4">
                        {addresses.length > 0 && (
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    if (addresses.length > 0) {
                                        const favoriteAddress = addresses.find(addr => addr.isFavorite);
                                        if (favoriteAddress) {
                                            handleSelectAddress(favoriteAddress.id);
                                        }
                                    }
                                    setShowNewAddressForm(false);
                                }}
                                disabled={isLoading}
                            >
                                <MapPin className="w-4 h-4 mr-2" />
                                Usar Endereço Cadastrado
                            </Button>
                        )}

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="zipCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>CEP</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="12345-678" 
                                                        {...field}
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/\D/g, "");
                                                            const formatted = value.length > 5 
                                                                ? `${value.slice(0, 5)}-${value.slice(5, 8)}` 
                                                                : value;
                                                            field.onChange(formatted);
                                                        }}
                                                        onBlur={(e) => {
                                                            const cleanCep = e.target.value.replace(/\D/g, "");
                                                            if (cleanCep.length === 8) {
                                                                handleSearchCep();
                                                            }
                                                        }}
                                                        disabled={isLoading}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <div className="flex items-end pb-2">
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={handleSearchCep}
                                            disabled={isLoadingCep || isLoading}
                                            className="w-full"
                                        >
                                            {isLoadingCep ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Search className="w-4 h-4 mr-2" />
                                                    Buscar
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                    
                                    <FormField
                                        control={form.control}
                                        name="street"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Rua</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nome da rua" {...field} disabled={isLoading} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="number"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Número</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="123" {...field} disabled={isLoading} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="complement"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel>Complemento (opcional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Apto 101, Bloco A" {...field} disabled={isLoading} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="neighborhood"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bairro</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nome do bairro" {...field} disabled={isLoading} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-3">
                                                <FormLabel>Cidade</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nome da cidade" {...field} disabled={isLoading} />
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
                                                    <Input placeholder="MG" maxLength={2} {...field} disabled={isLoading} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Processando..." : "Finalizar Pedido"}
                                </Button>
                            </form>
                        </Form>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}


