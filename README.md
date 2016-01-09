# vocabtrainer
##To use:
- cd ../vocabtrainer
- node seedEntriesFromCSV.js
- npm install
- npm start

##Description:
This is my first promise-style node application, written after 7pm mid week, and on Sundays. So bare with me.
Functionality is as follows:

##Views:
#####index
- login/ sign up with email

#####user
- list existing dictionaries
- link to add new dictionary
- (link to see stats, such as frequency/ success graphs/ view most loved/ hated words etc)
 
#####addDictionary
- set language1
- set language2
- unique name (default to Language1-Language2)

#####addEntry
- phrase in language1 (must be unique)
- phrase in language2 (must be unique)
- category (e.g. noun, verb)
- tag (e.g. 'cooking' or 'SummerClass2015')
- 'like'

#####quiz
- chose tags to be tested on Can be several
- chose which language to be quizzed in (l1 or l2) dropdown
- randomly select a word from chosen tags. prompt to input translation
- get help (jokers tbd)
- show example sentences (http://www.macmillandictionary.com/us/live/example-sentences.html)
 
##Controller/ Functionality:
- can use joker (e.g. show first letter, or indicate number of letters looking for)
- integrate API from ... to display similar words
- batch upload words from CSV

##models:
####Entry
- phrase language1 (String)
- phrase language2 (String)
- category (String)
- mnemonic (String)
- tags [String]
- level: (Number) //1 (beginner) - 5 (professional)
- dateCreated: (Date)
- dateUpdated: (Date)
- dictionary: dictId // could become array if i want to reuse entries
- userId: (String)

####User
- email
- name
- ~~dicts [dictionairies]~~
- lastDictUsedToEnter: _dictId
- lastDictUsedToTest: _dictId
 
####Dictionary
- language1: String
- language2: String
- name: String
- user: Id
- public: boolean
- user: string (Id)
- public: boolean

####Quiz
- entry object with the following:
 - EntryID (ID)  
 - lastTested (Date)
 - lastAnswerSuccessful: (Boolean)
 - percentSuccess: (Number)
 - like: (Number) //0: dont test, 1: test regularly, 2: test frequently
 - ...
