module.exports = {
    getChallengeInform: function (challenge_team_name, be_challenge_team_name, match_time, match_position) {
        return `${challenge_team_name}邀请您的球队${be_challenge_team_name} 于${match_position}${match_time}进行友谊赛`
    }
}