# vocabtrainer

This is my first node application, written after 7pm mid week, and on Sundays. So bare with me.
Functionality is as follows:

##Views:
#####user
- list existing dictionaries
- link to add new dictionary
- (link to see stats, such as frequency/ success graphs/ view most loved/ hated words etc)
 
#####addDictionary
- set language1
- set language2
- unique name (default to Language1-Language2)

#####addEntry
- phrase in language1
- phrase in language2
- category (e.g. noun, verb)
- tag (e.g. 'cooking' or 'SummerClass2015')
- 'like'

#####quiz
-[chose tags to be tested on] Can be several
- chose which language to be quizzed in (l1 or l2) dropdown
- randomly select a word from chosen tags. prompt to input translation
 
##Controller/ Functionality:
- can use joker (e.g. show first letter, or indicate number of letters looking for

##models:
####Entry
- l1 (string)
- l2 (string)
- category (string)
- lastTested (Date)
- lastAnswerSuccessful: bool
- percentSuccess: number
- _userId
- like: boolean //will be tested more regularly

####User
- email
- name
- dicts [dictionairies]
- lastDictUsed: _dictId
 
####Dictionary
- language1
- language2
- [entryID]
- _userId
