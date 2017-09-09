from flask import Flask, render_template, request

app = Flask(__name__)

sQueue = []
gQueue = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/match', methods=["POST"])
def match():
    peerID  = request.form["peerID"]
    style   = request.form["group1"]
    print(peerID, style)
    if style == "sippori":
        if sQueue.length > 0:
            r = sQueue[-1]
            sQueue.pop()
            return r
        else:
            sQueue.append(peerID)
            return 0
    else:
        if gQueue.length > 0:
            r = gQueue[-1]
            gQueue.pop()
            return r
        else:
            gQueue.append(peerID)
            return 0

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0')
