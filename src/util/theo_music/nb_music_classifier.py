import numpy as np
import pandas as pd 
import pickle as pkl
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
import random
train = pd.read_csv("archive/lyrics.csv")

X = train["lyrics"].values

from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

lemmatizer = WordNetLemmatizer()
# corpus = []

def cleanLyric(r):
    rlow = r.lower()
    rlist = rlow.split()
    no_stop = [word for word in rlist if word not in stopwords.words("english")]
    no_complicate = [lemmatizer.lemmatize(word) for word in no_stop]
    restring = ' '.join(no_complicate)
    if random.random() > .99:
        print(restring)
    return restring

clv = np.vectorize(cleanLyric)
from sklearn.feature_extraction.text import CountVectorizer

X = clv(X)

cv = CountVectorizer()
cv.fit(X)
X = cv.fit_transform(X)

print(X)
Y = train['song_name'].values
print(Y.shape)

with open("XYcv2.pkl", "wb") as file:
    pkl.dump([X, Y, cv], file)

print(X.shape,Y.shape)
print(X,Y)

from sklearn.naive_bayes import MultinomialNB

model = MultinomialNB()

# Model training
model.fit(np.asarray(X.todense()), Y)
from sklearn.metrics import (
    accuracy_score,
    f1_score,
)

y_pred = model.predict(np.asarray(X.todense()))
accuracy = accuracy_score(y_pred, Y)
f1 = f1_score(y_pred, Y, average="weighted")



print("Accuracy:", accuracy)
print("F1 Score:", f1)

with open("model3.pkl", "wb") as file:
    pkl.dump(model, file)

print("complete")

s = "scary story dungeon monster evil"

print(model.predict(cv.transform([cleanLyric(s)])))