'use client';

import { createAddress, deleteAddress, getAddresses, setFavoriteAddress } from "@/actions/address.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AddressResponseDTO } from "@/dtos/addressDTO";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heart, Loader2, MapPin, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const addressFormSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    street: z.string().min(3, "Rua deve ter pelo menos 3 caracteres"),
    number: z.string().min(1, "Número é obrigatório"),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, "Bairro deve ter pelo menos 2 caracteres"),
    city: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
    state: z.string().min(2, "Estado deve ter pelo menos 2 caracteres"),
    zipCode: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido (ex: 12345-678)"),
});

type AddressFormData = z.infer<typeof addressFormSchema>;

export default function AddressList() {
    const [addresses, setAddresses] = useState<AddressResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingCep, setIsLoadingCep] = useState(false);

    const form = useForm<AddressFormData>({
        resolver: zodResolver(addressFormSchema),
        defaultValues: {
            name: "",
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
        setIsLoading(true);
        try {
            const data = await getAddresses();
            setAddresses(data.addresses);
        } catch (error) {
            console.error("Erro ao carregar endereços:", error);
            toast.error("Erro ao carregar endereços");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchCep = async () => {
        const zipCode = form.getValues("zipCode");
        
        if (!zipCode) {
            toast.error("Digite um CEP");
            return;
        }

        // Remove non-numeric characters
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

    const handleSubmit = async (data: AddressFormData) => {
        setIsSubmitting(true);
        try {
            await createAddress({
                ...data,
                isFavorite: addresses.length === 0, // First address is favorite
            });
            toast.success("Endereço adicionado com sucesso!");
            setIsDialogOpen(false);
            form.reset();
            loadAddresses();
        } catch (error) {
            console.error("Erro ao criar endereço:", error);
            toast.error(error instanceof Error ? error.message : "Erro ao criar endereço");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este endereço?")) {
            return;
        }

        try {
            await deleteAddress(id);
            toast.success("Endereço excluído com sucesso!");
            loadAddresses();
        } catch (error) {
            console.error("Erro ao excluir endereço:", error);
            toast.error(error instanceof Error ? error.message : "Erro ao excluir endereço");
        }
    };

    const handleSetFavorite = async (id: string, isFavorite: boolean) => {
        try {
            await setFavoriteAddress(id, { isFavorite });
            toast.success(isFavorite ? "Endereço marcado como favorito!" : "Endereço favorito removido!");
            loadAddresses();
        } catch (error) {
            console.error("Erro ao definir favorito:", error);
            toast.error(error instanceof Error ? error.message : "Erro ao definir favorito");
        }
    };

    return (
        <div className="space-y-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar endereço
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Novo Endereço</DialogTitle>
                        <DialogDescription>
                            Adicione um novo endereço de entrega
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome do endereço</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Casa, Trabalho..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                                        disabled={isLoadingCep}
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
                                                <Input placeholder="Nome da rua" {...field} />
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
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Complemento (opcional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Apto 101, Bloco A" {...field} />
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
                                            <Input placeholder="Nome do bairro" {...field} />
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
                                                <Input placeholder="Nome da cidade" {...field} />
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
                                                <Input placeholder="MG" maxLength={2} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Salvando..." : "Salvar"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                    Carregando endereços...
                </div>
            ) : addresses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum endereço cadastrado</p>
                    <p className="text-sm mt-2">Adicione seu primeiro endereço para começar</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                        <Card key={address.id} className="bg-card border-border">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium text-card-foreground">{address.name}</h3>
                                        {address.isFavorite && (
                                            <Badge variant="secondary" className="text-xs">
                                                <Heart className="w-3 h-3 mr-1 fill-current" />
                                                Favorito
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleSetFavorite(address.id, !address.isFavorite)}
                                        >
                                            <Heart className={`w-4 h-4 ${address.isFavorite ? 'fill-current text-primary' : ''}`} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleDelete(address.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                                <Separator className="my-2" />
                                <div className="space-y-1 text-sm text-muted-foreground">
                                    <p>
                                        {address.street}, {address.number}
                                        {address.complement && ` - ${address.complement}`}
                                    </p>
                                    <p>{address.neighborhood}</p>
                                    <p>
                                        {address.city} - {address.state}, {address.zipCode}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
