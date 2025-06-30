import kagglehub

from pathlib import Path
import shutil

path = kagglehub.dataset_download("naserabdullahalam/phishing-email-dataset")


print("Path to dataset files:", path)

source = Path("/home/mkjdz/.cache/kagglehub/datasets/naserabdullahalam/phishing-email-dataset/versions/1")
target = Path(__file__).resolve().parent / "datasets" 
target.mkdir(parents=True, exist_ok=True)

for file in source.iterdir():
    shutil.copy(file, target)



#Modify to your path with your system