from jira.exceptions import JIRAError
import constants

def get_ticket_using_ticket_id(jira, id):
    '''
    fetch issue from jira using ticket: id

    ------------------------------------
    jira : authenticate jira user object.
    id : ticket id
    '''
    try:
        return jira.issue(id)
    except:
        raise JIRAError(constants.JIRAERROR_TICKET_NOT_EXIST)


def get_ticket_using_jql(jira, jql):
    '''
    perform jira apis using jql query

    --------------------------------
    jira: authenticate jira user object.
    jql: jql query
    '''
    try:
        return jira.search_issues(jql)
    except:
        raise JIRAError(constants.JIRAERROR_TICKET_NOT_EXIST)


def get_ticket_using_sprint(jira, sprint):
    '''
    fetch spring using sprint id

    ----------------------------
    jira: authenticate jira user object.
    sprint: sprint id
    '''
    try:
        return get_ticket_using_jql(jira, jql=f'Sprint = {sprint}')
    except:
        raise JIRAError(constants.SPRINT_TICKET_NOT_EXIST)


def add_ticket_comment(jira, ticket_id, comment):
    '''
    add comment to ticket id

    ----------------------------
    jira : authenticate jira user object.
    id : ticket id where we want to add comment
    comment: comment text
    '''
    try:
        issue = jira.issue(ticket_id.split(";")[0])
        comment = jira.add_comment(issue ,comment)
    except:
        raise JIRAError(constants.JIRAERROR_COMMENT)

def add_estimation(jira, ticket_id, estimation, custom_fields=constants.JIRAESTIMATION_CUSTOMFIELD):
    try:
        issue = jira.issue(ticket_id.split(";")[0])
        issue.update(fields={custom_fields: estimation})
    except:
        raise JIRAError(constants.JIRAERROR_TICKET_NOT_EXIST)
