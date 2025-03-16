return (
    <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        textAlign: "center",
        fontFamily: "inherit",
        color: "black",
        padding: "20px",
        boxSizing: "border-box",
        backgroundColor: "#ffffff"
    }}>
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            maxWidth: "700px",
            margin: "20px auto",
            padding: "20px",
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
        }}>
            <h1 style={{ fontSize: "2em", marginBottom: "10px" }}>Чакроскоп</h1>
            <p style={{ fontSize: "1em", color: "#666", marginBottom: "20px" }}>
                Это как гороскоп, только твой персональный. Он рассказывает о том, 
                <a 
                    href="https://www.instagram.com/reel/DG_9shMhIVk/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: "#007bff", textDecoration: "none" }}
                >
                    как
                </a> в тебе течёт энергия.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                <label style={{ fontSize: "1em" }}>Введите дату рождения:</label>
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} style={{ padding: "8px", fontSize: "1em", backgroundColor: "#ffffff" }} />
                <button onClick={handleCheckChakra} style={{ padding: "8px 16px", fontSize: "1em", cursor: "pointer" }}>Рассчитать</button>
            </div>

            {birthChakra && (
                <div style={{ width: "100%" }}>
                    {/* Блок 1 - Ты сформирован от рождения как */}
                    <div style={{
                        backgroundColor: "white",
                        padding: "15px",
                        borderRadius: "8px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        marginBottom: "10px",
                        width: "100%",
                        textAlign: "left"
                    }}>
                        <h4>Ты сформирован от рождения как:</h4>
                        <p style={{ whiteSpace: "pre-wrap" }}>{birthChakra.birth}</p>
                    </div>

                    {/* Блок 3 - Сегодня */}
                    <div style={{
                        backgroundColor: "white",
                        padding: "15px",
                        borderRadius: "8px",
                     
