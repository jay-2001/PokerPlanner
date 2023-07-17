from jira import JIRA
from jira.exceptions import JIRAError

from jira_integration import utils


class JiraIntegration:
    """
    JiraIntegration

    ---------------------------------
    create object for use using his jira credentials
    

    ----------------------------------------------
    Functionality provide by JiraIntegration class

    [1]. Authenticate user
    [2]. Fetch Jira Ticket
    [3]. Fetch Jira Sprint
    [4]. Perform jql query
    [5]. Add comment to issue
    [6]. Add Estimation to Ticket
    """
    def __init__(self, jira_domain, jira_email, jira_token):
        self.jira_domain = jira_domain
        self.jira_email = jira_email
        self.jira_token = jira_token

    @staticmethod
    def convert_jira_issue_to_dictionary(issue):
        '''
        it structure data fetch from raw feilds.
        '''
        jira_data = {
            'jira_ticket': str(issue.key) + ";" + issue.raw['fields']['issuetype']['self'],
            'summary': issue.raw['fields']['summary'],
            'description': issue.raw['fields']['description']
        }
        return jira_data

    
    def jira_authentication(self):
        try:
            jira_options = {
                'server': self.jira_domain
            }
            jira = JIRA(options=jira_options, basic_auth=(self.jira_email, self.jira_token))
            return jira
        except JIRAError:
            raise JIRAError('Invalid jira credentials.')
    
    @staticmethod
    def jira_ticket(jira, ticket_id):
        issue = utils.get_ticket_using_ticket_id(jira, ticket_id)
        return [JiraIntegration.convert_jira_issue_to_dictionary(issue)]

    @staticmethod
    def jira_sprint(jira, sprint):
        return [JiraIntegration.convert_jira_issue_to_dictionary(ticket)\
                for ticket in utils.get_ticket_using_sprint(jira, sprint)]

    @staticmethod
    def jira_ticket_sql(jira, jql):
        return [JiraIntegration.convert_jira_issue_to_dictionary(ticket)\
                for ticket in utils.get_ticket_using_jql(jira, jql)]

    @staticmethod
    def jira_ticket_comment(jira, ticket_id, comment):
        utils.add_ticket_comment(jira, ticket_id, comment)

    @staticmethod
    def jira_ticket_estimation(jira, ticket_id, estimation):
        utils.add_estimation(jira, ticket_id, estimation)
