# Permanente evaluatie

**Vul hieronder verder aan zoals beschreven in de opgave.**

## Scherm 1

Een loginscherm waarbij men een account kan maken en deze in een Supabase database kan zetten aan de hand van een gebruikersnaam, email en wachtwoord. 

## Scherm 2

Een startscherm met gerechten die opgehaald worden via een eigen API die gehost wordt op github en opgehaald word via Supabase. Men kan gerechten toevoegen en de toegevoegde gerechten verwijderen. Als men een gerecht toevoegt, wordt er gevraagd om een foto met behulp van de camera te maken, de voedingswaarde in te voeren, de benodigdheden in te vullen en stappen om het gerecht te maken. Dit nieuwe gerecht wordt dan ook toegevoegd aan de database.

## Scherm 3

Een detailscherm van een gerecht waar men kan zien hoe het gerecht eruitziet, wat men allemaal nodig heeft en hoe het gerecht gemaakt moet worden. Bij de stappen om het gerecht te maken, kan men naar links swipen om stappen af te vinken. Ook kan de gebruiker het gerecht inplannen in een agenda in de app.

## Scherm 4

Een agendapagina waar de gebruiker al zijn gerechten kan zien die hij heeft toegevoegd aan zijn agenda. De gebruiker kan hier gerechten verwijderen. Als de gebruiker op een van deze gerechten drukt, krijgt hij de detailpagina van het gerecht te zien.

## Scherm 5

Een settingsscherm waar de gebruiker zijn gegevens kan aanpassen of zijn account kan verwijderen.

## Native modules & Online services

- Camera
- Kalender
- ~~Eigen Api voor de vaste gerechten in de app~~
- Supabase voor de authentication, de database en het ophalen van ~~de api die gehost wordt op github~~
- **Gesture plugin en Reanimated voor het swipen van de stappen in het detailscherm**

# Feedback

In het onderdeel [scherm 2](#scherm-2) schrijf je dat de API gehost wordt op GitHub en opgehaald wordt via Supabase.
Ik weet niet goed wat je hiermee bedoeld.
Een API heeft een server nodig en GitHub Pages (voor zover ik weet de enige hosting service van GitHub) is niet geschikt
voor het hosten van een API.
Daarbovenop is Supabase een backend, voor elke tabel in de database wordt automatisch een API endpoint gegenereerd, je
moet dus geen API schrijven, maar die van Supabase gebruiken (via de Supabase client library).

Voor scherm 4 is het interessant om eens over de lay-out na te denken. 
Een agenda pagina is niet eenvoudig om op een duidelijke manier weer te geven. 

Voor scherm 5 spreek je over het verwijderen van een account, hiervoor heb je een edge function nodig die geschreven is 
in Deno. 
De reden hiervoor is dat je de admin key nodig hebt en die mag niet in de client side code staan. 
Ik wil je hier mee helpen aangezien edge functions buiten de scope van de cursus vallen. 

Score: 2/2
