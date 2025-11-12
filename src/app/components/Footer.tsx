import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

const primaryLinks = [
    { label: "Site Institucional", href: "#" },
    { label: "Fale Conosco", href: "#" },
    { label: "Conta e Segurança", href: "#" },
    { label: "Carreiras", href: "#" },
    { label: "Entregadores", href: "#" },
];

const discoverLinks = [
    { label: "Cadastre seu Restaurante ou Mercado", href: "#" },
    { label: "Smart Market Shop", href: "#" },
    { label: "Smart Market Empresas", href: "#" },
    { label: "Blog Smart Market Empresas", href: "#" },
];

const policyLinks = [
    { label: "Termos e condições de uso", href: "#" },
    { label: "Código de conduta", href: "#" },
    { label: "Privacidade", href: "#" },
    { label: "Dicas de segurança", href: "#" },
];

const socialLinks = [
    { label: "Facebook", href: "#", icon: Facebook },
    { label: "Twitter", href: "#", icon: Twitter },
    { label: "YouTube", href: "#", icon: Youtube },
    { label: "Instagram", href: "#", icon: Instagram },
];

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-border bg-background">
            <div className="container mx-auto px-4 py-10">
                <div className="grid gap-10 md:grid-cols-3">
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            Smart Market
                        </h2>
                        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                            {primaryLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="transition-colors hover:text-primary">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            Descubra
                        </h2>
                        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                            {discoverLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="transition-colors hover:text-primary">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            Social
                        </h2>
                        <div className="mt-4 flex gap-4 text-muted-foreground">
                            {socialLinks.map(({ icon: Icon, label, href }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="group flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary"
                                >
                                    <Icon className="h-5 w-5" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid gap-8 border-t border-border pt-8 text-sm text-muted-foreground md:grid-cols-[auto,1fr] md:items-center">
                    <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary text-xl font-semibold text-primary">
                            :)
                        </span>
                        <div>
                            <p className="font-semibold text-foreground">© 2021 Smart Market</p>
                            <p>Todos os direitos reservados Smart Market Online S.A.</p>
                            <p>CNPJ 00.000.000/0001-00 / Avenida dos Autonomistas, nº 1496, Vila Yara, Osasco/SP - CEP 06.020-902</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6 md:justify-end">
                        {policyLinks.map((link) => (
                            <Link key={link.label} href={link.href} className="transition-colors hover:text-primary">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}