import React, { useState } from "react";

function ArticlesApp() {
 
  const articlesData = [
    {
      userId: 1,
      id: 1,   
      title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
      body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
    },
    {
      userId: 1,
      id: 2,
      title: "qui est esse",
      body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
    },
    {
      userId: 2,
      id: 11,
      title: "et ea vero quia laudantium autem",
      body: "delectus reiciendis molestiae occaecati non minima eveniet qui voluptatibus\naccusamus in eum beatae sit\nvel qui neque voluptates ut commodi qui incidunt\nut animi commodi"
    }
  ];

  const [commentaires, setCommentaires] = useState([
    {
      postId: 1,
      id: 1,
      body: "laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus"
    },
    {
      postId: 1,
      id: 2,
      body: "est natus enim nihil est dolore omnis voluptatem numquam\net omnis occaecati"
    }
  ]);


  const [recherche, setRecherche] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [articleActuel, setArticleActuel] = useState(null);
  const [viewMode, setViewMode] = useState(""); // 'details' or 'comments'
  const [newCommentBody, setNewCommentBody] = useState("");
      
       
  const filteredArticles = articlesData.filter(a =>
    a.title.toLowerCase().includes(recherche.toLowerCase()) &&
    (userFilter === "" || a.userId === Number(userFilter))
  );

  const ajouterCommentaire = () => {
    if (newCommentBody.trim() !== "" && articleActuel) {
      const nouveau = {
        id: Date.now(),
        postId: articleActuel.id,
        body: newCommentBody
      };
      setCommentaires([...commentaires, nouveau]);
      setNewCommentBody("");
    }
  };

  const supprimerCommentaire = (id) => {
    setCommentaires(commentaires.filter(c => c.id !== id));
  };


  const styles = {
    container: { display: "flex", gap: "20px", padding: "20px", fontFamily: "Arial, sans-serif" },
    column: { border: "1px solid black", width: "50%", padding: "15px", minHeight: "90vh" },
    headerRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" },
    card: { border: "1px solid black", padding: "15px", marginBottom: "10px", position: "relative" },
    btnGroup: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" },
    button: { background: "#ADD8E6", border: "1px solid #777", padding: "5px 15px", cursor: "pointer", boxShadow: "2px 2px 2px #ccc" },
    input: { border: "1px solid black", padding: "5px" },
    textarea: { width: "100%", height: "60px", border: "1px solid black", marginTop: "10px", padding: "5px", resize: "none" }
  };

  return (
    <div style={styles.container}>
      
      {/* ================= LEFT COLUMN: ARTICLES ================= */}
      <div style={styles.column}>
        <div style={styles.headerRow}>
          <h1 style={{ margin: 0 }}>Articles</h1>
          <input 
            style={styles.input} 
            placeholder="Recherch" 
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)} 
          />
          <select style={styles.input} onChange={(e) => setUserFilter(e.target.value)}>
            <option value="">Utilisateur</option>
            <option value="1">User 1</option>
            <option value="2">User 2</option>
          </select>
        </div>

        {filteredArticles.map(art => (
          <div key={art.id} style={styles.card}>
            <div style={{ fontSize: "16px", fontWeight: "bold" }}>{art.title}</div>
            <div style={styles.btnGroup}>
              <button style={styles.button} onClick={() => { setArticleActuel(art); setViewMode("details"); }}>
                Détails
              </button>
              <button style={styles.button} onClick={() => { setArticleActuel(art); setViewMode("comments"); }}>
                Commentaires
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= RIGHT COLUMN: DETAILS / COMMENTS ================= */}
      <div style={styles.column}>
        {!articleActuel ? (
          <p>Please select an article to see details or comments.</p>
        ) : (
          <>
            <h1>{viewMode === "details" ? "Détails" : "Commentaires"}</h1>
            
            {/* --- VIEW: DETAILS --- */}
            {viewMode === "details" && (
              <div style={styles.card}>
                <p><strong>ID:</strong> {articleActuel.id}</p>
                <p><strong>User ID:</strong> {xarticleActuel.userId}</p>
                <p><strong>Title:</strong> {articleActuel.title}</p>
                <p><strong>Body:</strong> {articleActuel.body}</p>
              </div>
            )}

            {/* --- VIEW: COMMENTS --- */}
            {viewMode === "comments" && (
              <>
                {commentaires
                  .filter(c => c.postId === articleActuel.id)
                  .map(com => (
                    <div key={com.id} style={styles.card}>
                      <div>{com.body}</div>
                      <div style={styles.btnGroup}>
                        <button style={styles.button} onClick={() => supprimerCommentaire(com.id)}>
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}

                <textarea 
                  style={styles.textarea}
                  placeholder="Écrire un commentaire..."
                  value={newCommentBody}
                  onChange={(e) => setNewCommentBody(e.target.value)}
                />
                <div style={styles.btnGroup}>
                  <button style={styles.button} onClick={ajouterCommentaire}>
                    Ajouter
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>

    </div>
  );
}

export default ArticlesApp;


