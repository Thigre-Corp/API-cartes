//variable globale: l'id du deck utilisé, dans lequel on pioche
let idDeck = null;

//constante globale: URI du endpoint de demande du nouveau deck
const API_ENDPOINT_NEW_DECK = "https://deckofcardsapi.com/api/deck/new/"
//_________________: URI du endpoint de demande de mélange du deck selon l'ID
const getApiEndpointShuffleDeck =() => `https://deckofcardsapi.com/api/deck/${idDeck}/shuffle/`
//_________________: URI du endpoint de demande d'une carte issue du deck selon ID
const getApiEndpointDrawCard = () => `https://deckofcardsapi.com/api/deck/${idDeck}/draw/?count=1`
//_________________: élément HTML ustile pour la manipulation du DOM
const cardsContainer = document.getElementById("cards-container")

/*
* mis en place de l'écoute d'événement des deux boutons
*/
//éléments HTML concernés
const actionResetButton = document.getElementById("action-reset")
const actionDrawButton = document.getElementById("action-draw")
//écoute d'événement du lesboutons d'action
actionResetButton.addEventListener("click", actionReset)
actionDrawButton.addEventListener("click", actionDraw)

// fonction qui fait le fetch(), qui contacte l'API
async function callAPI(uri) {
    console.log("-- callAPI - start --")
    console.log("uri = ", uri)
 
    //fetch(), appel à l'API et réception de la réponse + affichage message en console en cas d'erreur
    const data = fetch(uri)
        .then ((response) =>{
            return response.json();
        })
        .catch(() =>{ console.error("Quelque chose ne va pas du tout avec l'API!")})
    /*
            const response = await fetch(uri);
            const data = await response.json();

    console.log('response = ', response)

    //récupération des données JSON reçues de l'API
    */
    console.log("data = ", data)

    console.log("-- callAPI - end --")

    //renvoi des données
    return data


}



/*
*   actions techniques
*/
    //fction de demande du nouveau deck
    async function getNewDeck(){
        console.log(">> getNewDeck()")
        return await callAPI(API_ENDPOINT_NEW_DECK)
    }

    //fction de demande de mélange du deck selon ID
    async function shuffleDeck() {
        console.log(">> shuffleDeck()")
        return await callAPI(getApiEndpointShuffleDeck())
    }
    //fction de demande d'une carte issue du deck selon idDeck
    async function drawCard(){
        console.log(">> drawCard()")
        return await callAPI(getApiEndpointDrawCard())
    }

/*
*   helpers
*/
    //supprime les cartes de l'ancien deck du DOM
    const cleanDomCardsFromPreviousDeck =() =>
        // récupération des cartes (classe CSS "card")
        document.querySelectorAll(".card")
        // et pour chacune de ces cartes
        .forEach((card)=>
            // supression du DOM
            card.remove()
        )

    //ajoute une carte dans le DOM (dans la zone des cartes piochées) d'après l'URI de son image
    function addCardToDomByImgUri(imgUri){
        //création de l'élément HTML "im", de class CSS "card" et avec pour attrivu HTML "src" l'URI reçue en argument
        const imgCardHtmlElement = document.createElement("img")
        imgCardHtmlElement.classList.add("card")
        imgCardHtmlElement.src = imgUri

        //ajout de cette image dnas la zone des cartes piocées ( en dernière position, dernier enfant de cardsConainter)
        cardsContainer.append(imgCardHtmlElement)
    }

/*
*   actions fonctionelles
*/
    // fction de réinitialisation
    async function actionReset(){
        // vider le dom des cartes de l'ancien deck
        cleanDomCardsFromPreviousDeck()

        //récupération nouveau deck
        const newDeckReponse = await getNewDeck()

        //récupérationde l'id du nouveau deck et mise à jour de la variable globale associée
        idDeck = newDeckReponse.deck_id

        //mélange du deck
        await shuffleDeck()
        actionDrawButton.removeAttribute("disabled")
    }

    // fction actionDraw - tirer un carte du deck
    async function actionDraw(){
        //diable le bouton draw le temps du traitement
        actionDrawButton.setAttribute("disabled", "");
        //appel à l'API pour demande au croupier de piocher une carte et de nous la renvoyer
        const drawCardResponse = await drawCard()

        console.log("DrawCardResponse = ", drawCardResponse)

        // récupération de l'URI de l'image de cette carte dans les données re_ues
        const imgCardUri = drawCardResponse.cards[0].image

        //ajout de la carte piochée dans la zone des carte piochées
        addCardToDomByImgUri(imgCardUri)
        if (drawCardResponse.remaining > 0 ) {
            actionDrawButton.removeAttribute("disabled")
        }
    }


/*
*   appel d'initialisation au lancement de l'application
*/
actionReset();

