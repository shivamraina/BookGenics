import numpy as np
import pandas as pd
import joblib
import re
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MultiLabelBinarizer
import sys, json

stop_words = set(stopwords.words('english'))
def remove_stopwords(text):
    no_stopword_text = [w for w in text.split() if not w in stop_words]
    return ' '.join(no_stopword_text)

def clean_text(text): 
    text = re.sub("\'", "", text) 
    text = re.sub("[^a-zA-Z]"," ",text)
    text = ' '.join(text.split()) 
    text = text.lower() 
    
    return text

def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])

def main():
    a = read_in()
    m = joblib.load('./ML/model-data/model1.pkl')

    xtrain = np.load('./ML/model-data/xtrain.npy', allow_pickle=True)
    xtrain = pd.Series(xtrain)

    tfidf_vectorizer = TfidfVectorizer(max_df=0.8, max_features=10000)
    xtrain_tfidf = tfidf_vectorizer.fit_transform(xtrain)

    genre_data = np.load('./ML/model-data/genre_data.npy', allow_pickle=True)
    genre_data = pd.Series(genre_data)
    multilabel_binarizer = MultiLabelBinarizer()
    multilabel_binarizer.fit(genre_data)

    a = clean_text(a)
    a = remove_stopwords(a)
    a = pd.Series(np.array([a]))

    xval_tfidf = tfidf_vectorizer.transform(a)
    y_pred = m.predict(xval_tfidf)
    ans = multilabel_binarizer.inverse_transform(y_pred)
    y_val_predicted_probabilites_tfidf = m.predict_proba(xval_tfidf)
    if len(ans[0]) == 0:
      max_idx = np.argmax(y_val_predicted_probabilites_tfidf)
      y_pred[0][max_idx] = 1
      ans = multilabel_binarizer.inverse_transform(y_pred)

    final_ans = []
    for x in ans[0]:
      final_ans.append(x)
    print(final_ans)

if __name__ == '__main__':
  main()