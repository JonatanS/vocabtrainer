app.factory("ScoreFactory", function(){
	return {
		correct: 0,
		incorrect: 0,
		numQuestionsAsked: 0,
		numQuestionsSkipped: 0,
		getPercentSuccess : function(){
			return numQuestionsAsked > 0 ? correct/ numQuestionsAsked : 0;
		}
	};
});