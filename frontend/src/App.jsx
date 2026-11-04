
import React, { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

// DANCING CHARACTER GAME
function DancingChallenge() {
    const [time, setTime] = useState(20);
    const [score, setScore] = useState(0);
    const [dance, setDance] = useState("dance-one");
    const [finished, setFinished] = useState(false);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (!started || finished) return;

        if (time <= 0) {
            setFinished(true);
            return;
        }

        const timer = setTimeout(() => {
            setTime(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [started, time, finished]);

    const changeDance = (move) => {
        if (finished) return;

        setStarted(true);
        setDance(move);
        setScore(prev => prev + 1);
    };

    const restartGame = () => {
        setTime(20);
        setScore(0);
        setDance("dance-one");
        setFinished(false);
        setStarted(false);
    };

    return (
        <div className="dance-game">
            <div className="game-sticker">✦ MINI GAME ✦</div>

            <div className="dance-heading">
                <div className="card-eyebrow">A LITTLE PLAY BREAK</div>
                <h2>Dance With Me!</h2>
                <p>Let's make this moment more fun!</p>
            </div>

            <div className="dance-stats">
                <div className="dance-stat">
                    <span>⏱️ TIME</span>
                    <strong>{time}s</strong>
                </div>

                <div className="dance-stat">
                    <span>⭐ SCORE</span>
                    <strong>{score}</strong>
                </div>
            </div>

            <div className="dance-stage">
                <span className="music-note note-one">🎵</span>
                <span className="music-note note-two">✨</span>
                <span className="music-note note-three">🎶</span>
                <span className="music-note note-four">⭐</span>

                <div className="dance-floor"></div>

                <div className={`dancing-character ${dance}`}>
                    <div className="character-face">😊</div>
                    <div className="character-body">🧸</div>
                </div>

                {finished && (
                    <div className="dance-result">
                        <div className="result-confetti">🎉 ✨ 🎊</div>
                        <h2>Amazing Dance!</h2>
                        <p>You completed the 20-second challenge!</p>
                        <strong>⭐ Your score: {score}</strong>
                    </div>
                )}
            </div>

            <div className="dance-instruction">
                {finished
                    ? "You are a superstar! 💜"
                    : started
                        ? "Keep dancing! Change my moves!"
                        : "Press a dance button to start!"}
            </div>

            {!finished ? (
                <div className="dance-buttons">
                    <button
                        type="button"
                        onClick={() => changeDance("dance-one")}
                        disabled={time === 0}
                    >
                        💃 Spin
                    </button>

                    <button
                        type="button"
                        onClick={() => changeDance("dance-two")}
                        disabled={time === 0}
                    >
                        🕺 Bounce
                    </button>

                    <button
                        type="button"
                        onClick={() => changeDance("dance-three")}
                        disabled={time === 0}
                    >
                        🎉 Groove
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    className="dance-restart"
                    onClick={restartGame}
                >
                    🔄 Dance Again
                </button>
            )}

            <div className="dance-footer">
                Made for happy moments ♡
            </div>
        </div>
    );
}

function Decorations() {
    return (
        <div className="decorations" aria-hidden="true">
            <span className="float-shape shape-a">✦</span>
            <span className="float-shape shape-b">✿</span>
            <span className="float-shape shape-c">★</span>
            <span className="float-shape shape-d">☁</span>
            <span className="float-shape shape-e">✧</span>
            <span className="float-shape shape-f">♡</span>
            <span className="float-shape shape-g">✦</span>
        </div>
    );
}

function Brand() {
    return (
        <div className="brand">
            <div className="brand-mark">S<span>✦</span></div>
            <div>
                <div className="brand-name">SecretDrop</div>
                <div className="brand-caption">A LITTLE WORLD OF SURPRISES</div>
            </div>
        </div>
    );
}

export default function App() {
    const [page, setPage] = useState("home");

    const [receiverName, setReceiverName] = useState("");
    const [secretCode, setSecretCode] = useState("");
    const [reply, setReply] = useState("");

    const [responseCode, setResponseCode] = useState("");
    const [responseResult, setResponseResult] = useState(null);

    const [senderUsername, setSenderUsername] = useState("sender");
    const [senderPassword, setSenderPassword] = useState("sender123");
    const [token, setToken] = useState("");

    const [message, setMessage] = useState("");
    const [sendCode, setSendCode] = useState("");
    const [images, setImages] = useState([]);
    const [receivedMessage, setReceivedMessage] = useState(null);
    const [responses, setResponses] = useState([]);

    const [notice, setNotice] = useState("");
    const [loading, setLoading] = useState(false);

    // RECEIVER LOGIN
    const handleReceiverLogin = async (e) => {
        e.preventDefault();

        if (!receiverName.trim() || !secretCode.trim()) {
            setNotice("Please enter your name and secret code.");
            return;
        }

        setLoading(true);
        setNotice("");

        try {
            const response = await fetch(`${API_URL}/api/messages/reveal`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    secretCode: secretCode.trim()
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "No message found.");
            }

            setReceivedMessage(result.data);

            if (result.data.alreadyResponded) {
                setPage("alreadyResponded");
                return;
            }

            setReply("");
            setPage("message");

        } catch (error) {
            setNotice(error.message || "Unable to retrieve your message.");
        } finally {
            setLoading(false);
        }
    };

    // SUBMIT RECEIVER RESPONSE
    const handleSubmitResponse = async () => {
        if (!reply.trim()) {
            setNotice("Please write your response before continuing.");
            return;
        }

        setLoading(true);
        setNotice("");

        try {
            const response = await fetch(`${API_URL}/api/messages/respond`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    secretCode: secretCode.trim(),
                    response: reply.trim()
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Could not send response.");
            }

            setPage("thankyou");

        } catch (error) {
            setNotice(error.message || "Unable to send response.");
        } finally {
            setLoading(false);
        }
    };

    // SENDER LOGIN
    const handleSenderLogin = async (e) => {
        e.preventDefault();

        setLoading(true);
        setNotice("");

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: senderUsername,
                    password: senderPassword
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Login failed.");
            }

            setToken(result.token);
            setPage("sender");

        } catch (error) {
            setNotice(error.message || "Unable to login.");
        } finally {
            setLoading(false);
        }
    };

    // SEND MESSAGE
    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!message.trim() || !sendCode.trim()) {
            setNotice("Please enter a message and secret code.");
            return;
        }

        if (images.length > 5) {
            setNotice("You can upload a maximum of 5 images.");
            return;
        }

        setLoading(true);
        setNotice("");

        try {
            const formData = new FormData();

            formData.append("message", message);
            formData.append("secretCode", sendCode.trim());

            images.forEach(image => formData.append("images", image));

            const response = await fetch(`${API_URL}/api/messages/send`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Message could not be sent.");
            }

            setNotice("Your SecretDrop has been sent successfully!");
            setMessage("");
            setSendCode("");
            setImages([]);

        } catch (error) {
            setNotice(error.message || "Unable to send your message.");
        } finally {
            setLoading(false);
        }
    };

    // LOAD SENDER RESPONSES
    const handleGetResponses = async () => {
        setLoading(true);
        setNotice("");

        try {
            const response = await fetch(`${API_URL}/api/messages/responses`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Could not load responses.");
            }

            setResponses(result.data || []);
            setPage("responses");

        } catch (error) {
            setNotice(error.message || "Unable to load responses.");
        } finally {
            setLoading(false);
        }
    };

    // RESPOND PORTAL
    const handleFindResponse = async (e) => {
        e.preventDefault();

        if (!responseCode.trim()) {
            setNotice("Please enter your secret code.");
            return;
        }

        setLoading(true);
        setNotice("");
        setResponseResult(null);

        try {
            const response = await fetch(
                `${API_URL}/api/messages/response-by-code`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        secretCode: responseCode.trim()
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Unable to find response.");
            }

            setResponseResult(result.data);

        } catch (error) {
            setNotice(error.message || "Unable to retrieve response.");
        } finally {
            setLoading(false);
        }
    };

    // HOME
    const goHome = () => {
        setPage("home");
        setNotice("");
        setReceivedMessage(null);
        setReceiverName("");
        setSecretCode("");
        setReply("");
        setResponseCode("");
        setResponseResult(null);
    };

    const goToPortal = (portal) => {
        setNotice("");
        setPage(portal);
    };

    return (
        <div className={`app page-${page}`}>
            <Decorations />

            {page !== "message" && (
                <header className="topbar">
                    <button
                        className="nav-link nav-left"
                        onClick={() => goToPortal("respondPortal")}
                    >
                        <span>↙</span> Respond Portal
                    </button>

                    <button className="brand-button" onClick={goHome}>
                        <Brand />
                    </button>

                    <button
                        className="nav-link nav-right"
                        onClick={() => goToPortal("senderLogin")}
                    >
                        Sender Portal <span>↗</span>
                    </button>
                </header>
            )}

            {/* HOME */}
            {page === "home" && (
                <main className="home-layout">
                    <section className="home-intro">
                        <div className="eyebrow">
                            <span>✦</span> YOUR LITTLE MOMENT OF MAGIC
                        </div>

                        <h1>
                            Open a little
                            <span className="gradient-word"> happiness.</span>
                        </h1>

                        <p className="intro-copy">
                            A special message is waiting just for you.
                            Enter your details, unlock your surprise
                            and enjoy the little moment.
                        </p>

                        <div className="hero-art">
                            <div className="art-cloud cloud-left">☁</div>
                            <div className="art-cloud cloud-right">☁</div>
                            <div className="art-spark spark-left">✦</div>
                            <div className="art-spark spark-right">✧</div>

                            <div className="hero-envelope">
                                <div className="envelope-paper">
                                    <span>For you!</span>
                                    <small>A little surprise</small>
                                    <b>♡</b>
                                </div>
                                <div className="envelope-back"></div>
                                <div className="envelope-flap"></div>
                                <div className="envelope-front"></div>
                                <div className="envelope-heart">♥</div>
                            </div>

                            <div className="art-caption">
                                <span>✦</span> SOMETHING WONDERFUL IS INSIDE
                            </div>
                        </div>

                        <div className="hero-tags">
                            <span>✉ Little messages</span>
                            <span>★ Happy moments</span>
                            <span>♡ Sweet surprises</span>
                        </div>
                    </section>

                    <section className="form-column">
                        <div className="form-card home-card">
                            <div className="card-top-icon">✉</div>
                            <div className="card-eyebrow">YOUR SURPRISE IS READY</div>
                            <h2>Discover your message</h2>
                            <p className="card-subtitle">
                                Just two little details and you're in!
                            </p>

                            <form onSubmit={handleReceiverLogin}>
                                <div className="field">
                                    <label>Your name</label>
                                    <div className="input-wrap">
                                        <span>☺</span>
                                        <input
                                            value={receiverName}
                                            onChange={e => setReceiverName(e.target.value)}
                                            placeholder="What should we call you?"
                                        />
                                    </div>
                                </div>

                                <div className="field">
                                    <label>Your secret code</label>
                                    <div className="input-wrap">
                                        <span>♧</span>
                                        <input
                                            type="password"
                                            value={secretCode}
                                            onChange={e => setSecretCode(e.target.value)}
                                            placeholder="Enter your special code"
                                        />
                                    </div>
                                </div>

                                <button className="primary-button" disabled={loading}>
                                    {loading ? "Opening your surprise..." : "Reveal my message"}
                                    <span>→</span>
                                </button>
                            </form>

                            {notice && <div className="notice">{notice}</div>}

                            <div className="card-footnote">
                                <span>✦</span> Your little surprise is one step away
                            </div>
                        </div>


                    </section>
                </main>
            )}

            {/* RESPOND PORTAL */}
            {page === "respondPortal" && (
                <main className="center-page">
                    <section className="form-card portal-card">
                        <button className="back-button" onClick={goHome}>
                            ← Back home
                        </button>

                        <div className="large-icon pink-icon">↩</div>
                        <div className="card-eyebrow">A LITTLE NOTE BACK</div>
                        <h2>Respond Portal</h2>
                        <p className="card-subtitle">
                            Enter the secret code connected to your message
                            and see the response waiting for you.
                        </p>

                        <form onSubmit={handleFindResponse}>
                            <div className="field">
                                <label>Secret code</label>
                                <div className="input-wrap">
                                    <span>♧</span>
                                    <input
                                        type="password"
                                        value={responseCode}
                                        onChange={e => {
                                            setResponseCode(e.target.value);
                                            setResponseResult(null);
                                            setNotice("");
                                        }}
                                        placeholder="Enter your secret code"
                                    />
                                </div>
                            </div>

                            <button className="primary-button" disabled={loading}>
                                {loading ? "Looking for your response..." : "Find my response"}
                                <span>→</span>
                            </button>
                        </form>

                        {notice && <div className="notice">{notice}</div>}

                        {responseResult && (
                            <div className="response-result">
                                <div className="result-label">THE ORIGINAL MESSAGE</div>
                                <div className="result-message">
                                    {responseResult.message}
                                </div>

                                <div className="result-divider">✦ ✦ ✦</div>

                                <div className="result-label">A NOTE BACK TO YOU</div>
                                <div className="result-response">
                                    {responseResult.response}
                                </div>

                                <div className="response-date">
                                    Responded: {responseResult.respondedAt
                                        ? new Date(responseResult.respondedAt).toLocaleString()
                                        : "Date unavailable"}
                                </div>
                            </div>
                        )}

                        <div className="card-footnote">
                            <span>♡</span> Some words deserve a reply
                        </div>
                    </section>
                </main>
            )}

            {/* SENDER LOGIN */}
            {page === "senderLogin" && (
                <main className="center-page">
                    <section className="form-card portal-card">
                        <button className="back-button" onClick={goHome}>
                            ← Back home
                        </button>

                        <div className="large-icon yellow-icon">✉</div>
                        <div className="card-eyebrow">CREATE A LITTLE MAGIC</div>
                        <h2>Sender Portal</h2>
                        <p className="card-subtitle">
                            Sign in and prepare a special message for someone.
                        </p>

                        <form onSubmit={handleSenderLogin}>
                            <div className="field">
                                <label>Username</label>
                                <div className="input-wrap">
                                    <span>☺</span>
                                    <input
                                        value={senderUsername}
                                        onChange={e => setSenderUsername(e.target.value)}
                                        placeholder="Enter username"
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label>Password</label>
                                <div className="input-wrap">
                                    <span>♧</span>
                                    <input
                                        type="password"
                                        value={senderPassword}
                                        onChange={e => setSenderPassword(e.target.value)}
                                        placeholder="Enter password"
                                    />
                                </div>
                            </div>

                            <button className="primary-button" disabled={loading}>
                                {loading ? "Signing in..." : "Enter sender portal"}
                                <span>→</span>
                            </button>
                        </form>

                        {notice && <div className="notice">{notice}</div>}
                    </section>
                </main>
            )}

            {/* SENDER DASHBOARD */}
            {page === "sender" && (
                <main className="center-page">
                    <section className="form-card wide-card">
                        <button className="back-button" onClick={goHome}>
                            ← Back home
                        </button>

                        <div className="large-icon yellow-icon">✎</div>
                        <div className="card-eyebrow">MAKE SOMEONE SMILE</div>
                        <h2>Create a SecretDrop</h2>
                        <p className="card-subtitle">
                            Write your message, choose a secret code and add
                            pictures if you like.
                        </p>

                        <form onSubmit={handleSendMessage}>
                            <div className="field">
                                <label>Your message</label>
                                <textarea
                                    className="message-input"
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    placeholder="Write something wonderful..."
                                />
                            </div>

                            <div className="field">
                                <label>Create a secret code</label>
                                <div className="input-wrap">
                                    <span>♧</span>
                                    <input
                                        type="password"
                                        value={sendCode}
                                        onChange={e => setSendCode(e.target.value)}
                                        placeholder="Create a code to share with the receiver"
                                    />
                                </div>
                            </div>

                            <div className="upload-box">
                                <div className="upload-icon">▧</div>
                                <div>
                                    <strong>Add some pictures</strong>
                                    <p>Optional · Up to 5 images · 5 MB each</p>
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={e => {
                                        const selected = Array.from(e.target.files || []);

                                        if (selected.length > 5) {
                                            setNotice("You can upload a maximum of 5 images.");
                                            e.target.value = "";
                                            setImages([]);
                                            return;
                                        }

                                        if (selected.some(image => image.size > 5 * 1024 * 1024)) {
                                            setNotice("Each image must be within 5 MB.");
                                            e.target.value = "";
                                            setImages([]);
                                            return;
                                        }

                                        setNotice("");
                                        setImages(selected);
                                    }}
                                />
                            </div>

                            {images.length > 0 && (
                                <div className="selected-files">
                                    <div className="image-preview-container">
                                        {images.map((image, index) => (
                                            <div className="image-preview" key={index}>
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt="Preview"
                                                />

                                                <button
                                                    type="button"
                                                    className="remove-image"
                                                    onClick={() => {
                                                        setImages(prev =>
                                                            prev.filter((_, i) => i !== index)
                                                        );
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button className="primary-button" disabled={loading}>
                                {loading ? "Sending your SecretDrop..." : "Send SecretDrop"}
                                <span>✦</span>
                            </button>
                        </form>

                        <button
                            className="secondary-button"
                            onClick={handleGetResponses}
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "♡ View received responses"}
                        </button>

                        {notice && <div className="notice">{notice}</div>}
                    </section>
                </main>
            )}

            {/* RECEIVER MESSAGE + DANCING GAME */}
            {page === "message" && receivedMessage && (
                <main className="message-layout">
                    <div className="message-header">
                        <button className="back-button" onClick={goHome}>
                            ← Home
                        </button>

                        <Brand />

                        <div className="message-header-tag">
                            A LITTLE SURPRISE FOR YOU ✦
                        </div>
                    </div>

                    <div className="receiver-layout">
                        <section className="game-panel">
                            <DancingChallenge />
                        </section>

                        <section className="letter-card">
                            <div className="letter-decoration">✦</div>

                            <div className="letter-top">
                                <div className="letter-stamp">♡</div>
                                <div className="card-eyebrow">SOMETHING JUST FOR YOU</div>
                                <h1>Your Special Message</h1>
                                <div className="letter-divider">
                                    <span>✦</span>
                                </div>
                            </div>

                            <div className="receiver-greeting">
                                Dear {receiverName || "friend"},
                            </div>

                            <div className="message-content">
                                {receivedMessage.message}
                            </div>

                            {receivedMessage.images?.length > 0 && (
                                <div className="received-images">
                                    {receivedMessage.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={`${API_URL}${image}`}
                                            alt={`Message image ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            )}

                            <div className="letter-bottom">
                                Sent with a little sunshine <span>☀</span>
                            </div>

                            <div className="reply-section">
                                <div className="card-eyebrow">YOUR TURN</div>
                                <label>Send a little note back</label>

                                <textarea
                                    value={reply}
                                    onChange={e => setReply(e.target.value)}
                                    maxLength={2000}
                                    placeholder="Write your response here..."
                                />

                                <div className="character-count">
                                    {reply.length}/2000
                                </div>

                                <button
                                    className="primary-button"
                                    onClick={handleSubmitResponse}
                                    disabled={loading}
                                >
                                    {loading ? "Sending your note..." : "Send my response"}
                                    <span>→</span>
                                </button>

                                {notice && <div className="notice">{notice}</div>}
                            </div>
                        </section>
                    </div>
                </main>
            )}

            {/* THANK YOU */}
            {page === "thankyou" && (
                <main className="center-page">
                    <section className="form-card success-card">
                        <div className="success-art">
                            <span className="success-star">✦</span>
                            <div className="success-heart">♥</div>
                            <span className="success-spark">✧</span>
                        </div>

                        <div className="card-eyebrow">MESSAGE DELIVERED</div>
                        <h2>Thank you, {receiverName}!</h2>

                        <p className="card-subtitle">
                            Your response has been sent successfully.
                            Your kind words are now on their way.
                        </p>

                        <div className="success-confetti">
                            ✦　♡　✧　★　♡
                        </div>

                        <button className="primary-button" onClick={goHome}>
                            Back to home <span>→</span>
                        </button>
                    </section>
                </main>
            )}

            {/* ALREADY RESPONDED */}
            {page === "alreadyResponded" && (
                <main className="center-page">
                    <section className="form-card success-card">
                        <div className="large-icon green-icon">✓</div>
                        <div className="card-eyebrow">ALL CAUGHT UP</div>
                        <h2>You've already replied!</h2>

                        <p className="card-subtitle">
                            A response has already been submitted for this message.
                            Thanks for taking a moment to write back.
                        </p>

                        <button className="primary-button" onClick={goHome}>
                            Back to home <span>→</span>
                        </button>
                    </section>
                </main>
            )}

            {/* SENDER RESPONSES */}
            {page === "responses" && (
                <main className="center-page">
                    <section className="form-card wide-card">
                        <button
                            className="back-button"
                            onClick={() => {
                                setNotice("");
                                setPage("sender");
                            }}
                        >
                            ← Back to Sender Portal
                        </button>

                        <div className="large-icon pink-icon">♡</div>
                        <div className="card-eyebrow">NOTES THAT CAME BACK</div>
                        <h2>Received Responses</h2>

                        <p className="card-subtitle">
                            Here's what people have written back to your messages.
                        </p>

                        {responses.length === 0 ? (
                            <div className="empty-state">
                                <div>✉</div>
                                <strong>No responses just yet</strong>
                                <p>When someone replies, their note will appear here.</p>
                            </div>
                        ) : (
                            responses.map(item => (
                                <div className="response-card" key={item._id}>
                                    <div className="result-label">
                                        YOUR ORIGINAL MESSAGE
                                    </div>

                                    <p>{item.message}</p>

                                    <div className="response-card-divider"></div>

                                    <div className="result-label">
                                        THEIR RESPONSE ♡
                                    </div>

                                    <p>{item.response}</p>

                                    <div className="response-date">
                                        Received: {item.respondedAt
                                            ? new Date(item.respondedAt).toLocaleString()
                                            : "Date unavailable"}
                                    </div>
                                </div>
                            ))
                        )}

                        <button
                            className="secondary-button"
                            onClick={handleGetResponses}
                            disabled={loading}
                        >
                            {loading ? "Refreshing..." : "↻ Refresh responses"}
                        </button>
                    </section>
                </main>
            )}

            {page !== "message" && (
                <footer className="site-footer">
                    <span>SecretDrop <b>✦</b></span>
                    <span>Little messages. Big smiles.</span>
                    <span>Made for happy moments ♡</span>
                </footer>
            )}
        </div>
    );
}
