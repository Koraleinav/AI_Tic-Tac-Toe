from django.urls import path
from . import views

urlpatterns = [
    path('new/', views.start_new_game, name='start_new_game'),
    path('<int:game_id>/move/', views.make_move, name='make_move'),
    path('<int:game_id>/', views.get_game_state, name='get_game_state'),
]