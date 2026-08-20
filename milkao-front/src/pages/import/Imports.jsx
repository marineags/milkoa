import { useEffect, useState } from 'react'
import './Imports.css'
import Header from '../../components/header/Header.jsx'

function Imports() {

    const [history, setHistory] = useState([])

    
  const [selectedFile, setSelectedFile] = useState(null)

  const [importType, setImportType] = useState("production")

  useEffect(() => {
  fetch("http://localhost:8080/imports/history")
    .then((response) => response.json())
    .then((data) => {
      setHistory(data)
    })
    .catch((error) => {
      console.error("Erreur historique :", error)
    })
}, [])

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setSelectedFile(file)
  }

const handleImport = async () => {
  if (!selectedFile) return

  const formData = new FormData()
  formData.append("file", selectedFile)

  let endpoint = ""
  let typeLabel = ""

  if (importType === "production") {
  endpoint = "http://localhost:8080/imports/production"
  typeLabel = "Production"

} else if (importType === "feeding") {
  endpoint = "http://localhost:8080/imports/feeding"
  typeLabel = "Alimentation"

} else if (importType === "cows") {
  endpoint = "http://localhost:8080/imports/cows"
  typeLabel = "Vaches"
}

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    })

    const message = await response.text()

    console.log("Status :", response.status)
    console.log("Réponse backend :", message)

    if (!response.ok) {
      throw new Error(message)
    }

    alert(message)

    setHistory((prev) => [
      {
        fileName: selectedFile.name,
        type: typeLabel,
        importDate: new Date().toISOString(),
        status: "Importé"
      },
      ...prev
    ])

    setSelectedFile(null)

  } catch (error) {
    console.error("Erreur import :", error)
    alert(error.message)
  }
}
  return (
    <section className="imports-page">
      <Header />

      <div className="imports-title">
        <div>
          <h2>Imports</h2>
          <p>Ajoutez les données utilisées par Milkao.</p>
        </div>
      </div>

      <div className="imports-grid">
        <article className="import-panel">
          <div className="import-panel-title">
  <div className="import-title-left">
    <span className="import-icon">📄</span>

    <div>
      <h3>Importer un fichier</h3>
      <p>Formats acceptés : CSV</p>
    </div>
  </div>

  <div className="import-type-selector">
    <label>Type de données</label>

  <select
  value={importType}
  onChange={(event) => setImportType(event.target.value)}
>
  <option value="production">Production</option>
  <option value="feeding">Alimentation</option>
  <option value="cows">Vaches</option>
</select>
  </div>
</div>

<label className="upload-zone">
  <input
    type="file"
    accept=".csv"
    onChange={handleFileChange}
  />

  <span className="upload-icon">☁️</span>

  <strong>
    Cliquez pour sélectionner un fichier
  </strong>

  <p>
    ou déposez votre fichier ici
  </p>
</label>

          {selectedFile && (
  <div className="selected-file">
    <div>
      <span>📎</span>

      <div>
        <strong>{selectedFile.name}</strong>
        <p>
          {(selectedFile.size / 1024).toFixed(1)} Ko
        </p>
      </div>
    </div>

    <button
      type="button"
      onClick={() => setSelectedFile(null)}
    >
      Retirer
    </button>
  </div>
)}

<button
  type="button"
  className="import-button"
  disabled={!selectedFile}
  onClick={handleImport}
>
  Importer les données
</button>
        </article>

        <article className="import-panel">
          <h3>Types de données</h3>

          <div className="import-types">
            <div className="import-type">
              <span>🥛</span>

              <div>
                <strong>Production</strong>
                <p>Données de traite des vaches</p>
              </div>
            </div>

            <div className="import-type">
              <span>🌾</span>

              <div>
                <strong>Alimentation</strong>
                <p>Coûts alimentaires du troupeau</p>
              </div>
            </div>

            <div className="import-type">
              <span>🐄</span>

              <div>
                <strong>Vaches</strong>
                <p>Informations du troupeau</p>
              </div>
            </div>
          </div>
        </article>
      </div>

      <article className="history-panel">
  <div className="history-header">
    <div>
      <h3>Historique des imports</h3>
      <p>Derniers fichiers traités</p>
    </div>
  </div>

  <div className="history-table">
    <div className="history-row history-labels">
      <span>Fichier</span>
      <span>Type</span>
      <span>Date</span>
      <span>Statut</span>
    </div>

    {history.map((item, index) => (
      <div className="history-row" key={index}>
        <strong>{item.fileName}</strong>
        <span>{item.type}</span>
        <span>{new Date(item.importDate).toLocaleString("fr-FR")}</span>
        <span className="import-status success">
          {item.status}
        </span>
      </div>
    ))}
  </div>
</article>
    </section>
  )
}

export default Imports