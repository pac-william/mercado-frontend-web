'use client'

import { useEffect, useMemo, useState } from "react"

import { AddressDomain } from "@/app/domain/addressDomain"
import { CartResponse } from "@/dtos/cartDTO"

import DeliveryForm from "./DeliveryForm"
import OrderSummary from "./OrderSummary"
import PaymentMethod, { type PaymentMethod as PaymentMethodType } from "./PaymentMethod"

interface CheckoutContentProps {
    addresses: AddressDomain[]
    cart: CartResponse
}

export default function CheckoutContent({ addresses, cart }: CheckoutContentProps) {
    const defaultAddress = useMemo(
        () => addresses.find((address) => address.isFavorite) ?? addresses[0],
        [addresses],
    )

    const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(defaultAddress?.id)
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("CREDIT_CARD")

    useEffect(() => {
        if (!addresses.length) {
            setSelectedAddressId(undefined)
            return
        }

        if (selectedAddressId && addresses.some((address) => address.id === selectedAddressId)) {
            return
        }

        setSelectedAddressId(defaultAddress?.id)
    }, [addresses, defaultAddress, selectedAddressId])

    return (
        <div className="flex flex-1 gap-4">
            <div className="flex flex-1 flex-col gap-4">
                <PaymentMethod selectedMethod={paymentMethod} onSelect={setPaymentMethod} />
                <DeliveryForm
                    addresses={addresses}
                    selectedAddressId={selectedAddressId}
                    onAddressSelected={setSelectedAddressId}
                />
            </div>

            <div className="w-[380px] h-[calc(100vh-100px)] sticky top-4">
                <div className="flex flex-col gap-4 h-full">
                    <OrderSummary
                        cart={cart}
                        addresses={addresses}
                        selectedAddressId={selectedAddressId}
                        paymentMethod={paymentMethod}
                    />
                </div>
            </div>
        </div>
    )
}

