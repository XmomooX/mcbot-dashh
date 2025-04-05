import { useState } from "react";
import { Navigate } from "react-router-dom";
import "./css/Home.css"

export function Home() {
    const [formData, setFormData] = useState({
        botname: "",
        serverIP: "",
        serverPort: "",
        serverVersion: "",
    });
    const [shouldNavigate, setShouldNavigate] = useState(false);
    const [navigationPath, setNavigationPath] = useState("");
    const serverURL = "https://mcbot-dashh.onrender.com"

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${serverURL}/createbot`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server error:", errorData);
                return;
            }

            const result = await response.json();
            console.log("Server response:", result);

            if (result.redirectUrl) {
                const cleanPath = result.redirectUrl
                    .replace(window.location.origin, "")
                    .replace(/^\/?#\/?/, "/");
                setNavigationPath(cleanPath);
                setShouldNavigate(true);
            }

        } catch (error) {
            console.error("Fetch error:", error);
        }
    };


    if (shouldNavigate) {
        return <Navigate to={navigationPath} />;
    }

    return (
        <>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Home</title>
            <div className="main">
                <form onSubmit={handleSubmit} className="form">
                    <input
                        name="botname"
                        placeholder="Bot name"
                        className="nameInp"
                        required
                        value={formData.botname}
                        onChange={handleChange}
                    />
                    <input
                        name="serverIP"
                        placeholder="Server IP"
                        className="ip"
                        required
                        value={formData.serverIP}
                        onChange={handleChange}
                    />
                    <input
                        name="serverPort"
                        placeholder="Server port, Leave empty for default"
                        className="port"
                        value={formData.serverPort}
                        onChange={handleChange}
                    />
                    <input
                        name="serverVersion"
                        placeholder="Server version"
                        className="version"
                        required
                        value={formData.serverVersion}
                        onChange={handleChange}
                    />
                    <button type="submit" className="submitform">Create bot</button>
                </form>
            </div>
        </>
    );
}