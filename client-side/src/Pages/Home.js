export function Home() {
    return (
        <>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Home</title>
            <form action="http://localhost:4000/startbot" method="POST">
                <button type="submit">join</button>
            </form>
        </>
    )
}