module.exports = `
<entity id="survey-voting-template" class="template">
	<card>
		<h3>How did you like today's <text id="type"/> from <text id="venue"/>?</h3>
		<p>
			Please provide feedback by clicking one of the stars below to rate the meal.
		</p>
		<p>
			<action id="onestar"/>
			<action id="twostars"/>
			<action id="threestars"/>
			<action id="fourstars"/>
			<action id="fivestars"/>
		</p>
		<p>
			Voting ends at <text id="end"/>
		</p>
	</card>
</entity>`;
