from flask import Flask, render_template, request, jsonify
import sqlite3
import random

app = Flask(__name__)

# Database Setup
def init_db():
    conn = sqlite3.connect('database/db.sqlite3')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS texts (id INTEGER PRIMARY KEY, text TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS results (id INTEGER PRIMARY KEY, user_id TEXT, wpm INTEGER, errors INTEGER, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def home():
    conn = sqlite3.connect('database/db.sqlite3')
    c = conn.cursor()
    c.execute("SELECT text FROM texts ORDER BY RANDOM() LIMIT 1")
    result = c.fetchone()
    conn.close()

    if result:
        random_text = result[0]
    else:
        random_text = "Você é praticamente o cara mais rápido de todos, capaz de digitar palavras com velocidade incrível enquanto mantém a precisão e supera qualquer obstáculo que apareça no caminho, provando que a prática leva à perfeição e transformando cada tecla pressionada em um passo rumo ao sucesso."

    return render_template('index.html', random_text=random_text)

@app.route('/save_result', methods=['POST'])
def save_result():
    data = request.get_json()
    user_id = data.get('user_id')
    wpm = data.get('wpm')
    errors = data.get('errors')

    conn = sqlite3.connect('database/db.sqlite3')
    c = conn.cursor()
    c.execute("INSERT INTO results (user_id, wpm, errors) VALUES (?, ?, ?)", (user_id, wpm, errors))
    conn.commit()
    conn.close()

    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True)