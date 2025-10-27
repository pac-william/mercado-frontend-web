"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Loader2, MapPin, Search } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface AddressData {
    cep: string
    logradouro: string
    complemento: string
    bairro: string
    localidade: string
    uf: string
}

export default function AddressInput() {
    const [cep, setCep] = useState("")
    const [loading, setLoading] = useState(false)
    const [address, setAddress] = useState<AddressData | null>(null)

    const handleSearchCEP = async () => {
        if (!cep.trim()) {
            toast.error("Digite um CEP")
            return
        }

        // Remove non-numeric characters
        const cleanCep = cep.replace(/\D/g, "")

        if (cleanCep.length !== 8) {
            toast.error("CEP deve ter 8 dígitos")
            return
        }

        setLoading(true)
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
            const data = await response.json()

            if (data.erro) {
                toast.error("CEP não encontrado")
                setAddress(null)
            } else {
                setAddress({
                    cep: data.cep,
                    logradouro: data.logradouro,
                    complemento: data.complemento,
                    bairro: data.bairro,
                    localidade: data.localidade,
                    uf: data.uf
                })
                toast.success("Endereço encontrado!")
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error)
            toast.error("Erro ao buscar endereço")
            setAddress(null)
        } finally {
            setLoading(false)
        }
    }

    const handleClearAddress = () => {
        setAddress(null)
        setCep("")
    }

    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="text-lg font-bold text-card-foreground flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Calcular Frete
                </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-col gap-3">
                {!address ? (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="cep" className="text-sm text-card-foreground">CEP</Label>
                        <div className="flex gap-2">
                            <Input
                                id="cep"
                                placeholder="00000-000"
                                value={cep.replace(/(\d{5})(\d{3})/, '$1-$2')}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "")
                                    if (value.length <= 8) {
                                        setCep(value)
                                    }
                                }}
                                disabled={loading}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearchCEP()
                                    }
                                }}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleSearchCEP}
                                disabled={!cep.trim() || loading}
                                variant="outline"
                                size="icon"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Search className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Digite o CEP para calcular o frete
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-card-foreground">Endereço Encontrado</h3>
                            <Button
                                onClick={handleClearAddress}
                                variant="ghost"
                                size="sm"
                                className="h-auto p-1"
                            >
                                Alterar
                            </Button>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg border border-border">
                            <div className="flex flex-col gap-1 text-sm">
                                <div>
                                    <span className="text-muted-foreground">CEP: </span>
                                    <span className="text-card-foreground font-medium">{address.cep.replace(/(\d{5})(\d{3})/, '$1-$2')}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Rua: </span>
                                    <span className="text-card-foreground font-medium">{address.logradouro}</span>
                                </div>
                                {address.complemento && (
                                    <div>
                                        <span className="text-muted-foreground">Complemento: </span>
                                        <span className="text-card-foreground font-medium">{address.complemento}</span>
                                    </div>
                                )}
                                <div>
                                    <span className="text-muted-foreground">Bairro: </span>
                                    <span className="text-card-foreground font-medium">{address.bairro}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Cidade: </span>
                                    <span className="text-card-foreground font-medium">{address.localidade} - {address.uf}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

