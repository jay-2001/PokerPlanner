from collections import namedtuple

ROLE_CHOICES = (
    (0, 'Player'), (1, 'Spectator')
)
Roles = namedtuple('Role', ['player', 'spectator'])
roles = Roles(0, 1)

VOTING_SYSTEM_CHOICES = (
    (0, 'Fibonacci'),
    (1, 'Odd'),
    (2, 'Even'),
    (3, 'Serial'),
    (4, 'Custom')
)
VotingSystem = namedtuple('VotingSystem', ['fibonacci', 'odd', 'even', 'serial', 'custom'])
voting_system = VotingSystem(0, 1, 2, 3, 4)

GENDER_CHOICES = (
    (0, 'Male'),
    (1, 'Female'),
    (2, 'Dont want to disclose')
)

MEMBER_OPERATIONS = {
    'ADD_MEMBERS': 'add_members',
    'REMOVE_MEMBERS': 'remove_members',
}

JIRA_OPERATIONS = {
    'SPRINT': 'sprint',
    'TICKET': 'issue',
    'JQL': 'jql',
}

GROUP_CNT_LIMIT = 2
DEFAULT_GAME_TIMER_IN_SECONDS = 30

Genders = namedtuple('Genders', ['male', 'female', 'no_disclose'])
genders = Genders(0, 1, 2)

DESCRIPTION_MAX_LEN = 500
NAME_MAX_LEN = 100
CHARFIELD_MAX_LEN = 255
STATE_MAX_LEN = 50
CITY_MAX_LEN = 90
ZIP_CODE_MAX_LEN = 6
TICKET_SUMMARY_MAX_LEN = 200
GROUP_NAME_MAX_LEN = 20
BOARD_NAME_MAX_LEN = 50
JIRAERROR_TICKET_NOT_EXIST = 'Ticket does not exist'
SPRINT_TICKET_NOT_EXIST = 'Sprint does not exist'
JIRAERROR_COMMENT = 'Comment is Not Added to Ticket. Check are you trying to add\
                    comment in right ticket or not or Ticket is exists?.'
JIRAESTIMATION_CUSTOMFIELD = 'customfield_10016'
