from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Game
from .serializers import GameSerializer
import json

@api_view(['POST'])
def start_new_game(request):
    """Starts a new Tic-Tac-Toe game."""
    initial_board = [None] * 9
    game = Game.objects.create(board=initial_board)
    serializer = GameSerializer(game)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
def make_move(request, game_id):
    """Makes a move in the specified game."""
    try:
        game = Game.objects.get(pk=game_id)
    except Game.DoesNotExist:
        return Response({"error": "Game not found."}, status=status.HTTP_404_NOT_FOUND)

    try:
        data = json.loads(request.body.decode('utf-8'))
        position = data.get('position')
    except (json.JSONDecodeError, AttributeError):
        return Response({"error": "Invalid request data."}, status=status.HTTP_400_BAD_REQUEST)

    if position is None or not isinstance(position, int) or not 0 <= position < 9:
        return Response({"error": "Invalid move position."}, status=status.HTTP_400_BAD_REQUEST)

    board = game.board
    if board[position] is not None:
        return Response({"error": "That position is already taken."}, status=status.HTTP_400_BAD_REQUEST)

    board[position] = game.current_player

    # Check for win
    winning_combinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Columns
        [0, 4, 8], [2, 4, 6]              # Diagonals
    ]
    winner = None
    for combo in winning_combinations:
        if all(board[i] == game.current_player for i in combo):
            winner = game.current_player
            break

    # Check for draw
    is_draw = all(cell is not None for cell in board) and winner is None

    game.board = board
    game.winner = winner
    game.is_draw = is_draw
    game.current_player = 'O' if game.current_player == 'X' else 'X'
    game.save()

    serializer = GameSerializer(game)
    return Response(serializer.data)

@api_view(['GET'])
def get_game_state(request, game_id):
    """Retrieves the current state of the specified game."""
    try:
        game = Game.objects.get(pk=game_id)
        serializer = GameSerializer(game)
        return Response(serializer.data)
    except Game.DoesNotExist:
        return Response({"error": "Game not found."}, status=status.HTTP_404_NOT_FOUND)