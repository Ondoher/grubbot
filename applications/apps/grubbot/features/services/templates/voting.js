module.exports = `
<entity id="survey-voting-template" class="template">
	<card>
		<header>
			<h3>Grubbot Survey for <text id="venue"/></h3>
		</header>
		<body>
			<div>
			How did you like today's lunch from <text id="venue"/>?
			Please provide feedback by clicking one of the
			stars below to rate the meal.
			</div><br/>
			<div>
			Voting ends at <text id="end"/>
			</div>
			<hr/>
			<action id="onestar"/>
			<action id="twostars"/>
			<action id="threestars"/>
			<action id="fourstars"/>
			<action id="fivestars"/>
			<br/>
		</body>
	</card>
</entity>`;
