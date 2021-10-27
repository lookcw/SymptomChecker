# Hello! Thanks for looking at my submission. Hope you like it
## Introduction

I want to preface by saying this took me more time than 6 hours, I likely spent about 8 to 10 hours total. I did not get a chance to deploy this to heroku, but I have deployed full stack apps to heroku eg: https://eat-in.herokuapp.com/. The front end is also very minimal. With that, lets get started.

## Start the app

Start the backend by running the commands below 

```
cd backend
virtualenv venv
pip install -r requirements.txt 
cd proj
python manage.py runserver
```

(note i avoid makemigration and migrate by giving the db.sqlite3 file. Ill discuss more about that decision below)

Now start the Frontend with the following

```
cd frontend/app
npm install && npm start
```

now visit http://localhost:3000 in your browser and you should see the app started. You can interact with it by checking off boxes next to supposed symptoms, then clicking on the submit button. You should see possible diseases on the right.


## How it works
There were a couple challenges building this. Ill go through how I thought about and tackled the problem, starting with the data and how I determine possible diseases, then move onto the backend and frontend.

### Data
To choose 20 symptoms out of thousands in that large xml file, I decided to find the 20 most common symptoms and use those. I then found all the diseases that had at least 7 of those top 20 symptoms then I included it in this app. It was somewhat arbitrary, but I didnt want to include diseases that had better symptoms as predictors that would not be included in this MVP app. I then put it into `db.sqlite3`. If this were a real product I would certainly create a postgres table (likely on aws) that acts as the back end. I chose sqlite because it was the easiest to send the db and since the data in it is already public, it is not as dangerous. Obviously if it stored user data it would have to be secured.

### How I calculated Disease Pathogenecity
Each symptom for each disease in the large xml file came with a frequency for that disease. My idea was to calculate the likelihood that a person has their state, given that they have a disease. Essentially P(symptoms|disease). To do this, for each symptom, I said likelihood of that state is given by the following. `Likelihood = 1 - frequency` if the patient does not have the symptom, and `Likelihood = frequency` if the patient does have the symptom. This makes it so that if the patient has the symptom, and the frequency is high, then the likelihood is also high, but if the patient does not have the symptom, and the frequency is high, then the likelihood of that occurring is low. Then I averaged the likelihood of all symptoms for a given disease and that becomes its likelihood score.

I calcuate this for each disease that a patient has a symptom for, and return the ones that have an average likelihood score of .55 or above.

As a small note, the frequencies in the xml files come in ranges that are rather wide. I ended up choosing the high end of the proability because I found that, because I exclude many symptoms in the large file, some diseases had only rare frequency symptoms in the database, and so, with no symptoms checked off, there were several diseases returned. I wanted to bias the calculation to return more diseases when more symptoms were checked off (a basic sanity test) so I chose to define frequency as the maximum of the range given in the xml file.

The definitons are below:

```
    case 'Very frequent (99-80%)':
        return 1
    case 'Frequent (79-30%)':
        return 0.8
    case 'Occasional (29-5%)':
        return 0.3
    case 'Very rare (<4-1%)':
        return 0.04
```

### Backend

This was my second project using django and my first one using GraphQL. I decided to use GraphQL because I have heard for some time that the industry is transitioning towards it and you mentioned you all use it. I spent a couple hours in the beginning just understanding how it worked. The business logic for this is in `backend/proj/diseases`. Thats where the disease calculation is done. I fully acknowledge that I did not take advantages of the core of graphQL: the ability to ask for data in a nested pattern, and only grab the information you need. However, I conciously chose against this because I believe the logic of calculating disease likelihood belongs to the server, it should be obfuscated from the user. I could have let the client pull the data points and calculated it clientside but exposing that code seems like an unhealthy practice. If we ever wanted to use machine learning, doing so client side in javascript would have been much more difficult. For these reasons I chose an almost rest like method of calculating the disease likelihood so we could abstract the logic from the client, and replace it with something more complex later if need be. 

I expose two query resolvers, one for the symptoms, and one that returns the likely diseases given the symptoms.
The former is just to create the checklist, and the latter is to return the likely diseases, the reason the customer is using the checker.

### Frontend

As you can likely tell, front end is not my forte. This was the last part of the project and Given more time I would certainly put more effort into making it look cleaner, but since this is an MVP, and I imagine this would serve the "hair on fire" customers, I decided I would put the least effort into it, since mistakes in front end could be reasonably fixed, but a miss in the backend would be a problem forever.


The frontend was all written in react, using react hooks from react 16.8 which aims to be stateless. Dealing with state has been the bane of my existance so I wanted to avoid it if possible.

It consists of SymptomList and SymptomChecker, with the former being a stateless component of the latter. You can find these files in `frontend/app/src`

## What else I would do
If I had more time there are quite a few things I would improve. 
* I made a mistake early on of not making a disease a model, I just return them as list of strings from django. They should be a model so if one day we wanted to add descriptions, links, photos, etc, we could do so. 
* migrate to postgres, and host it on EBS or heroku. 
* Improve the UI, possibly not including the disease list on the first page, and only displaying it after the user presses submit. This makes for a more clear and obvious UX, so theres no qusetion about what the User should be looking at
* Validate that symptoms and diseases make sense. A basic santity test found that as I increase the number of symptoms I check, so does the number of possible diseases, but this isnt perfect
* Unit tests and integration tests that would make sure my calculations are correct and that the GraphQL calls work correctly (maybe even using selenium)
