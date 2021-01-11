import math
import logging
import flask
from flask.globals import request

# setup server
app = flask.Flask(__name__)

# global data
maze = {
    'size': [10, 10],
    'map': [
      [[0, 0], [0, 10]],
      [[0, 10], [10, 10]],
      [[10, 10], [10, 0]],
      [[10, 0], [0, 0]],

      [[2, 9], [3, 9]],
      [[2, 10], [2, 8]],
      [[6, 10], [6, 9]],

      [[6, 0], [6, 4]],
      [[1, 2], [4, 2]],
      [[1, 2], [1, 5]],
      [[3, 4], [2, 1]],
      [[4, 4], [5, 5]],
      [[2, 4], [6, 1]],

      [[8, 6], [8, 8]],
      [[8, 8], [9, 8]],
      [[9, 5], [9, 8]],
      [[9, 5], [6, 5]],
    ]
}
user_id_count = 0
users = {}
defaultPosition = [5, 5]
defaultDirection = 150

# mock API response
@app.route('/api', methods=['POST'])
def index():
    req_data = request.get_json()
    # print('====================')
    # print('- req: ', req_data)

    if req_data['action'] == 'getUserId':
        global user_id_count
        user_id_count += 1
        id = str(user_id_count)
        users[id] = {
            'position': defaultPosition.copy(),
            'direction': defaultDirection,
            'step': 0
        }

        res = {
            'id': id
        }
        print('- res: ', res)
        return flask.jsonify(res)

    if req_data['action'] == 'getMaze':
        res = maze
        print('- res: ', res)
        return flask.jsonify(res)

    if req_data['action'] == 'getPosition':
        id = request.get_json()['id']
        if id in users:
            users[id]['direction'] = users[id]['step'] * 0.2 % 360
            users[id]['position'][0] = defaultPosition[0] + math.sin(users[id]['step'] * 0.3 * (math.pi / 180)) * 4
            users[id]['position'][1] = defaultPosition[0] + math.cos(users[id]['step'] * 0.3 * (math.pi / 180)) * 4
            users[id]['step'] += 1
            res = {
                'id': id,
                'position': users[id]['position'],
                'direction': users[id]['direction']
            }
        else:
            res = {
                'id': id,
                'position': defaultPosition,
                'direction': defaultDirection
            }
        # print('- res: ', res)
        return flask.jsonify(res)
    # print('====================')

def main():
    log = logging.getLogger('werkzeug')
    log.setLevel(logging.ERROR)
    app.config['DEBUG'] = True
    app.logger.disabled = True
    app.run(port=3400)

if __name__ == '__main__':
    main()
