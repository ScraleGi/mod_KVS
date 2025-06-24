import "./main.css"


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <title>Dummy Layout</title>
                <meta charSet="UTF-8" />
            </head>
            <body>{children}</body>
        </html>
    );
}
