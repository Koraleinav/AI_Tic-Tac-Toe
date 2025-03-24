from django.db import models

class Game(models.Model):
    board = models.JSONField(default=list)  # store the game board state
    current_player = models.CharField(max_length=1, default='X')
    winner = models.CharField(max_length=1, null=True, blank=True)
    is_draw = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)