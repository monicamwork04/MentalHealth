import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import h1 from "../assets/h1.jpeg";
import m1 from "../assets/m1.jpeg";
import i1 from "../assets/i1.jpeg";
import l1 from "../assets/l1.jpeg";

import h2 from "../assets/h2.jpeg";
import m2 from "../assets/m2.jpeg";
import i2 from "../assets/i2.jpeg";
import l2 from "../assets/l2.jpeg";

import h3 from "../assets/h3.jpeg";
import m3 from "../assets/m3.jpeg";
import i3 from "../assets/i3.jpeg";
import l3 from "../assets/l3.jpeg";

function QuotesPage() {
  const navigate = useNavigate();

  const defaultQuotes = [
    { text: "Happiness is a choice, not a result.", author: "Unknown", img: h1, likes: 0 },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", img: m1, likes: 0 },
    { text: "The best way to predict the future is to invent it.", author: "Alan Kay", img: i1, likes: 0 },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", img: l1, likes: 0 },

    { text: "Happiness depends upon ourselves.", author: "Aristotle", img: h2, likes: 0 },
    { text: "Do what you love, love what you do.", author: "Confucius", img: m2, likes: 0 },
    { text: "Dream big and dare to fail.", author: "Norman Vaughan", img: i2, likes: 0 },
    { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde", img: l2, likes: 0 },

    { text: "Act as if what you do makes a difference. It does.", author: "William James", img: h3, likes: 0 },
    { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey", img: m3, likes: 0 },
    { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein", img: i3, likes: 0 },
    { text: "Do small things with great love.", author: "Mother Teresa", img: l3, likes: 0 },
  ];

  const [quotes, setQuotes] = useState([]);
  const [likedQuotes, setLikedQuotes] = useState([]);
  const [savedQuotes, setSavedQuotes] = useState([]);

  useEffect(() => {
    setQuotes(defaultQuotes);

    const savedLiked = sessionStorage.getItem("likedQuotes");
    const savedSaved = sessionStorage.getItem("savedQuotes");

    if (savedLiked) setLikedQuotes(JSON.parse(savedLiked));
    if (savedSaved) setSavedQuotes(JSON.parse(savedSaved));
  }, []);

  useEffect(() => {
    sessionStorage.setItem("likedQuotes", JSON.stringify(likedQuotes));
    sessionStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));
  }, [likedQuotes, savedQuotes]);

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    localStorage.removeItem("token"); // clear auth token if stored
    localStorage.removeItem("user");  // clear user info if stored
    navigate("/login");               // redirect to login page
  };

  const handleLike = (index) => {
    if (likedQuotes.includes(index)) return;

    const updated = [...quotes];
    updated[index].likes += 1;
    setQuotes(updated);
    setLikedQuotes([...likedQuotes, index]);
  };

  const handleSave = (quote) => {
    if (savedQuotes.find(q => q.text === quote.text)) return;
    setSavedQuotes([...savedQuotes, quote]);
  };

  const handleWhatsAppShare = (quote) => {
    const message = `${quote.text} - ${quote.author}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleDownload = (quote) => {
    const link = document.createElement("a");
    link.href = quote.img;
    link.download = "quote.jpg";
    link.click();
  };

  return (
    <div className="quotes-page" style={{ position: "relative" }}>
      {/* 🔥 LOGOUT BUTTON */}
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "8px 15px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#2d3436",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        🚪 Logout
      </button>

      <h1>✨ Inspirational Quotes</h1>

      <div className="quotes-grid">
        {quotes.map((quote, index) => (
          <div key={index} className="quote-card">
            <img src={quote.img} alt="quote" className="quote-img" />

            <div className="quote-content">
              <p>"{quote.text}"</p>
              <span>- {quote.author}</span>

              <div className="buttons">
                <button
                  className={`like-btn ${likedQuotes.includes(index) ? "liked" : ""}`}
                  onClick={() => handleLike(index)}
                  disabled={likedQuotes.includes(index)}
                >
                  {likedQuotes.includes(index)
                    ? "💖 Liked"
                    : `❤️ Like ${quote.likes}`}
                </button>

                
                <button
                  className="share-btn"
                  onClick={() => handleWhatsAppShare(quote)}
                >
                  📲 WhatsApp
                </button>

                <button
                  className="download-btn"
                  onClick={() => handleDownload(quote)}
                >
                  ⬇ Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .quotes-page {
          max-width: 1200px;
          margin: auto;
          padding: 2rem;
          font-family: Arial;
        }

        .quote-card {
          display: flex;
          gap: 20px;
          background: #f9f9f9;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .quote-img {
          width: 220px;
          height: 150px;
          object-fit: cover;
          border-radius: 10px;
        }

        .buttons button {
          margin-right: 8px;
          margin-top: 8px;
          padding: 6px 12px;
          border: none;
          border-radius: 20px;
          cursor: pointer;
        }

        .like-btn { background: #ff6b6b; color: white; }
        .like-btn.liked { background: #28a745; }
        .save-btn { background: #007bff; color: white; }
        .share-btn { background: #25d366; color: white; }
        .download-btn { background: #6c757d; color: white; }

        @media(max-width:768px){
          .quote-card { flex-direction: column; }
          .quote-img { width: 100%; }
        }
      `}</style>
    </div>
  );
}

export default QuotesPage;