import React, { useState, useEffect } from "react";
import "./index.css";

function ArticlesApp() {
  // États
  const [articles, setArticles] = useState([]);
  const [commentaires, setCommentaires] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [filtreUtilisateur, setFiltreUtilisateur] = useState("");
  const [articleActuel, setArticleActuel] = useState(null);
  const [modeAffichage, setModeAffichage] = useState("details");
  const [nouveauCommentaire, setNouveauCommentaire] = useState({ 
    nom: "", 
    email: "", 
    contenu: "" 
  });
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  // Récupérer les données depuis l'API JSON
  useEffect(() => {
    const fetchData = async () => {
      try {
        setChargement(true);
        
        // Articles
        const reponseArticles = await fetch("https://jsonplaceholder.typicode.com/posts");
        if (!reponseArticles.ok) throw new Error("Erreur de chargement des articles");
        const donneesArticles = await reponseArticles.json();
        
        // Commentaires
        const reponseCommentaires = await fetch("https://jsonplaceholder.typicode.com/comments");
        if (!reponseCommentaires.ok) throw new Error("Erreur de chargement des commentaires");
        const donneesCommentaires = await reponseCommentaires.json();
        
        setArticles(donneesArticles.slice(0, 15));
        setCommentaires(donneesCommentaires.slice(0, 30));
        
        // Sélectionner le premier article par défaut
        if (donneesArticles.length > 0) {
          setArticleActuel(donneesArticles[0]);
        }
        
        setChargement(false);
      } catch (err) {
        setErreur("Échec du chargement des données. Vérifiez votre connexion.");
        setChargement(false);
      }
    };

    fetchData();
  }, []);

  // Filtrer les articles
  const articlesFiltres = articles.filter(article => {
    const correspondRecherche = article.title.toLowerCase().includes(recherche.toLowerCase());
    const correspondUtilisateur = filtreUtilisateur === "" || article.userId.toString() === filtreUtilisateur;
    return correspondRecherche && correspondUtilisateur;
  });

  // Utilisateurs uniques
  const utilisateursUniques = [...new Set(articles.map(article => article.userId))].sort((a, b) => a - b);

  // Ajouter un commentaire
  const ajouterCommentaire = () => {
    if (!nouveauCommentaire.contenu.trim() || !articleActuel) return;

    const comment = {
      postId: articleActuel.id,
      id: Date.now(),
      name: nouveauCommentaire.nom || "Utilisateur",
      email: nouveauCommentaire.email || "utilisateur@exemple.com",
      body: nouveauCommentaire.contenu
    };

    setCommentaires([comment, ...commentaires]);
    setNouveauCommentaire({ nom: "", email: "", contenu: "" });
  };

  // Supprimer un commentaire
  const supprimerCommentaire = (id) => {
    setCommentaires(commentaires.filter(comment => comment.id !== id));
  };

  // Commentaires de l'article actuel
  const commentairesActuels = commentaires.filter(comment => comment.postId === articleActuel?.id);

  // Mettre à jour le formulaire
  const mettreAJourCommentaire = (champ, valeur) => {
    setNouveauCommentaire(prev => ({ ...prev, [champ]: valeur }));
  };

  if (chargement) {
    return (
      <div className="chargement">
        <div className="spinner"></div>
        <h2>Chargement des données...</h2>
        <p>Depuis JSONPlaceholder API</p>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="erreur">
        <div className="icone-erreur"></div>
        <h2>Erreur</h2>
        <p>{erreur}</p>
        <button 
          className="btn-reessayer"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="application">
      {/* En-tête */}
      <header className="en-tete">
        <div className="contenu-en-tete">
          <h1>Blog d'Articles</h1>
          <p>
            {articles.length} articles • {commentaires.length} commentaires
          </p>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="conteneur-principal">
        {/* Colonne gauche - Articles */}
        <section className="colonne-articles">
          <div className="section-filtres">
            <h2>Liste des Articles</h2>
            <div className="filtres">
              <input
                type="text"
                className="champ-recherche"
                placeholder=" Rechercher un article..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
              />
              
              <select
                className="select-utilisateur"
                value={filtreUtilisateur}
                onChange={(e) => setFiltreUtilisateur(e.target.value)}
              >
                <option value=""> Tous les utilisateurs</option>
                {utilisateursUniques.map(id => (
                  <option key={id} value={id}>
                    Utilisateur {id}
                  </option>
                ))}
              </select>
            </div>
            <div className="info-filtres">
              <span className="badge-info">{articlesFiltres.length} article(s) trouvé(s)</span>
            </div>
          </div>

          <div className="liste-articles">
            {articlesFiltres.length === 0 ? (
              <div className="aucune-donnee">
                <p>Aucun article ne correspond à votre recherche</p>
              </div>
            ) : (
              articlesFiltres.map(article => (
                <div
                  key={article.id}
                  className={`carte-article ${articleActuel?.id === article.id ? 'selectionne' : ''}`}
                  onClick={() => {
                    setArticleActuel(article);
                    setModeAffichage("details");
                  }}
                >
                  <div className="en-tete-carte">
                    <div className="badge-utilisateur">
                      <span className="badge-icon"></span>
                      <span>User {article.userId}</span>
                    </div>
                    <span className="badge-id">#{article.id}</span>
                  </div>
                  
                  <h3 className="titre-article">
                    {article.title.length > 50 
                      ? `${article.title.substring(0, 50)}...` 
                      : article.title}
                  </h3>
                  
                  <p className="extrait-article">
                    {article.body.length > 80 
                      ? `${article.body.substring(0, 80)}...` 
                      : article.body}
                  </p>
                  
                  <div className="actions-carte">
                    <span className="nombre-commentaires">
                       {commentaires.filter(c => c.postId === article.id).length}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Colonne droite - Détails/Commentaires */}
        <section className="colonne-details">
          <div className="en-tete-details">
            <h2>
              {articleActuel ? articleActuel.title.substring(0, 40) + (articleActuel.title.length > 40 ? "..." : "") : "Sélection"}
            </h2>
            {articleActuel && (
              <div className="info-article">
                <span className="info-badge"> User {articleActuel.userId}</span>
                <span className="info-badge">#ID: {articleActuel.id}</span>
              </div>
            )}
          </div>

          {!articleActuel ? (
            <div className="selection-vide">
              <div className="icone-vide"></div>
              <h3>Selectionnez un article</h3>
              <p>Cliquez sur un article de la liste pour afficher ses détails</p>
            </div>
          ) : (
            <div className="contenu-details">
              {/* Onglets */}
              <div className="onglets">
                <button
                  className={`onglet ${modeAffichage === 'details' ? 'actif' : ''}`}
                  onClick={() => setModeAffichage("details")}
                >
                  Détails
                </button>
                <button
                  className={`onglet ${modeAffichage === 'commentaires' ? 'actif' : ''}`}
                  onClick={() => setModeAffichage("commentaires")}
                >
                   Commentaires ({commentairesActuels.length})
                </button>
              </div>

              {/* Détails de l'article */}
              {modeAffichage === "details" && (
                <div className="details-article">
                  <div className="carte-details">
                    <h3 className="titre-details">Contenu de l'article</h3>
                    <div className="corps-details">
                      <p>{articleActuel.body}</p>
                    </div>
                    <div className="stats-details">
                      <div className="stat-item">
                        <span className="stat-label">Nombre de commentaires :</span>
                        <span className="stat-value">{commentairesActuels.length}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Auteur :</span>
                        <span className="stat-value">User {articleActuel.userId}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section commentaires */}
              {modeAffichage === "commentaires" && (
                <div className="section-commentaires">
                  {/* Formulaire d'ajout */}
                  <div className="formulaire-ajout">
                    <h3> Ajouter un commentaire</h3>
                    <div className="groupe-formulaire">
                      <input
                        type="text"
                        className="champ-formulaire"
                        placeholder="Nom (optionnel)"
                        value={nouveauCommentaire.nom}
                        onChange={(e) => mettreAJourCommentaire("nom", e.target.value)}
                      />
                      <input
                        type="email"
                        className="champ-formulaire"
                        placeholder="Email (optionnel)"
                        value={nouveauCommentaire.email}
                        onChange={(e) => mettreAJourCommentaire("email", e.target.value)}
                      />
                    </div>
                    <textarea
                      className="zone-texte"
                      placeholder="Votre commentaire..."
                      value={nouveauCommentaire.contenu}
                      onChange={(e) => mettreAJourCommentaire("contenu", e.target.value)}
                      rows="3"
                    />
                    <div className="actions-formulaire">
                      <button
                        className="btn-publier"
                        onClick={ajouterCommentaire}
                        disabled={!nouveauCommentaire.contenu.trim()}
                      >
                        Publier le commentaire
                      </button>
                    </div>
                  </div>

                  {/* Liste des commentaires */}
                  <div className="liste-commentaires">
                    <h3>💬 Commentaires ({commentairesActuels.length})</h3>
                    
                    {commentairesActuels.length === 0 ? (
                      <div className="aucun-commentaire">
                        <p>Aucun commentaire. Soyez le premier à commenter !</p>
                      </div>
                    ) : (
                      commentairesActuels.map(commentaire => (
                        <div key={commentaire.id} className="carte-commentaire">
                          <div className="en-tete-commentaire">
                            <div className="info-auteur">
                              <strong className="auteur">
                                {commentaire.name}
                              </strong>
                              <small className="email">
                                {commentaire.email}
                              </small>
                            </div>
                            <button
                              className="btn-supprimer"
                              onClick={() => supprimerCommentaire(commentaire.id)}
                              title="Supprimer ce commentaire"
                            >
                              
                            </button>
                          </div>
                          <div className="contenu-commentaire">
                            <p>{commentaire.body}</p>
                          </div>
                          <div className="pied-commentaire">
                            <small className="date-commentaire">Commentaire #{commentaire.id}</small>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Pied de page */}
      <footer className="pied-page">
        <p>
          <strong>Blog d'Articles</strong> • Données de 
          <a href="https://jsonplaceholder.typicode.com" target="_blank" rel="noreferrer">
            JSONPlaceholder
          </a>
          • {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

export default ArticlesApp;