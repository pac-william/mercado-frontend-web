import Link from "next/link";

const APP_STORE_URL =
    process.env.NEXT_PUBLIC_APP_STORE_URL ??
    "https://apps.apple.com/";
const PLAY_STORE_URL =
    process.env.NEXT_PUBLIC_PLAY_STORE_URL ??
    "https://play.google.com/store/";

export default function MobileDownloadPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-6 py-12 text-center">
            <section className="max-w-xl space-y-6">
                <h1 className="text-3xl font-bold sm:text-4xl">
                    Baixe nosso aplicativo
                </h1>
                <p className="text-muted-foreground">
                    Acesse todos os recursos no aplicativo oficial. Escolha sua loja de
                    aplicativos preferida abaixo para iniciar o download.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
                    <Link
                        href={APP_STORE_URL}
                        className="inline-flex items-center justify-center rounded-md bg-black px-6 py-3 text-white transition hover:bg-black/80"
                    >
                        App Store
                    </Link>
                    <Link
                        href={PLAY_STORE_URL}
                        className="inline-flex items-center justify-center rounded-md bg-green-600 px-6 py-3 text-white transition hover:bg-green-600/80"
                    >
                        Google Play
                    </Link>
                </div>
            </section>
        </main>
    );
}

