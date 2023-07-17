from django.db import models

class VersioningControl(models.Model):
    """
    A class used as a base model class for every model in the project
    to store the created_at and updated_at fields in the database.

    ...

    Fields
    ----------
    created_at : datetime field
        stores the time of entry of object in database
    updated_at : datetime field
        stores the latest time of updation of anything in object in database
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        """
        A class which tells us extra properties of the VersioningControl class.
        Have its abstract attribute set to true.
        """
        abstract = True
