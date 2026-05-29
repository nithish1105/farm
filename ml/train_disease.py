import os
import json
import random
import numpy as np
from PIL import Image
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import torchvision.models as models
import torchvision.transforms as transforms

# Set random seed for reproducibility
random.seed(42)
np.random.seed(42)
torch.manual_seed(42)

# Configurations
datasets_dir = "/Users/nithishkumarreddy/Documents/farmer/datasets"
output_dir = "/Users/nithishkumarreddy/Documents/farmer/ml"
os.makedirs(output_dir, exist_ok=True)

# List of all classes we support
class_mapping = {
    # Classes from archive (7)
    "Healthy": os.path.join(datasets_dir, "archive (7)", "Train", "Train", "Healthy"),
    "Powdery": os.path.join(datasets_dir, "archive (7)", "Train", "Train", "Powdery"),
    "Rust": os.path.join(datasets_dir, "archive (7)", "Train", "Train", "Rust"),
    
    # Classes from PlantVillage
    "Pepper__bell___Bacterial_spot": os.path.join(datasets_dir, "PlantVillage", "Pepper__bell___Bacterial_spot"),
    "Pepper__bell___healthy": os.path.join(datasets_dir, "PlantVillage", "Pepper__bell___healthy"),
    "Potato___Early_blight": os.path.join(datasets_dir, "PlantVillage", "Potato___Early_blight"),
    "Potato___Late_blight": os.path.join(datasets_dir, "PlantVillage", "Potato___Late_blight"),
    "Potato___healthy": os.path.join(datasets_dir, "PlantVillage", "Potato___healthy"),
    "Tomato_Bacterial_spot": os.path.join(datasets_dir, "PlantVillage", "Tomato_Bacterial_spot"),
    "Tomato_Early_blight": os.path.join(datasets_dir, "PlantVillage", "Tomato_Early_blight"),
    "Tomato_Late_blight": os.path.join(datasets_dir, "PlantVillage", "Tomato_Late_blight"),
    "Tomato_Leaf_Mold": os.path.join(datasets_dir, "PlantVillage", "Tomato_Leaf_Mold"),
    "Tomato_Septoria_leaf_spot": os.path.join(datasets_dir, "PlantVillage", "Tomato_Septoria_leaf_spot"),
    "Tomato_Spider_mites_Two_spotted_spider_mite": os.path.join(datasets_dir, "PlantVillage", "Tomato_Spider_mites_Two_spotted_spider_mite"),
    "Tomato__Target_Spot": os.path.join(datasets_dir, "PlantVillage", "Tomato__Target_Spot"),
    "Tomato__Tomato_YellowLeaf__Curl_Virus": os.path.join(datasets_dir, "PlantVillage", "Tomato__Tomato_YellowLeaf__Curl_Virus"),
    "Tomato__Tomato_mosaic_virus": os.path.join(datasets_dir, "PlantVillage", "Tomato__Tomato_mosaic_virus"),
    "Tomato_healthy": os.path.join(datasets_dir, "PlantVillage", "Tomato_healthy")
}

class_names = sorted(list(class_mapping.keys()))
class_to_idx = {name: idx for idx, name in enumerate(class_names)}

print(f"Supported classes ({len(class_names)}): {class_names}")

# Collect image file paths and labels
data_items = []
max_images_per_class = 300  # Increase to 300 images per class for robust generalization

for name, path in class_mapping.items():
    if not os.path.exists(path):
        # Check duplicate nested path for PlantVillage
        alt_path = path.replace("PlantVillage", os.path.join("PlantVillage", "PlantVillage"))
        if os.path.exists(alt_path):
            path = alt_path
        else:
            print(f"WARNING: Directory not found: {path}")
            continue
            
    files = [os.path.join(path, f) for f in os.listdir(path) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp'))]
    print(f"Class '{name}': found {len(files)} files.")
    
    # Sample subset
    if len(files) > max_images_per_class:
        files = random.sample(files, max_images_per_class)
        
    for file_path in files:
        data_items.append((file_path, class_to_idx[name]))

print(f"Total dataset size: {len(data_items)} images.")

# Load pre-trained MobileNetV2 for feature extraction
try:
    feature_extractor = models.mobilenet_v2(pretrained=True)
    print("Successfully loaded pre-trained MobileNetV2 weights.")
except Exception as e:
    print(f"Could not load pre-trained weights ({e}). Initializing un-trained MobileNetV2.")
    feature_extractor = models.mobilenet_v2(pretrained=False)

feature_extractor.eval()
device = torch.device('cpu')
feature_extractor = feature_extractor.to(device)

# Image transformation
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Extract embeddings
print("Extracting embeddings using MobileNetV2...")
embeddings = []
labels = []
batch_size = 64

for i in range(0, len(data_items), batch_size):
    batch_items = data_items[i:i+batch_size]
    batch_tensors = []
    batch_labels = []
    
    for path, label in batch_items:
        try:
            image = Image.open(path).convert('RGB')
            tensor = transform(image)
            batch_tensors.append(tensor)
            batch_labels.append(label)
        except Exception:
            pass
            
    if not batch_tensors:
        continue
        
    batch_tensor = torch.stack(batch_tensors).to(device)
    with torch.no_grad():
        features = feature_extractor.features(batch_tensor)
        pooled = torch.nn.functional.adaptive_avg_pool2d(features, (1, 1))
        flat = pooled.view(pooled.size(0), -1)
        embeddings.append(flat.cpu())
        labels.extend(batch_labels)
        
    if (i // batch_size) % 10 == 0:
        print(f"Processed {i}/{len(data_items)} images...")

X = torch.cat(embeddings, dim=0)
y = torch.tensor(labels, dtype=torch.long)
print(f"Extraction complete. Embeddings shape: {X.shape}, Labels shape: {y.shape}")

# Split train/val
indices = torch.randperm(X.size(0))
split_idx = int(X.size(0) * 0.8)
train_indices = indices[:split_idx]
val_indices = indices[split_idx:]

X_train, y_train = X[train_indices], y[train_indices]
X_val, y_val = X[val_indices], y[val_indices]

# Dataset and DataLoader for the MLP
class EmbeddingDataset(Dataset):
    def __init__(self, features, targets):
        self.features = features
        self.targets = targets
        
    def __len__(self):
        return len(self.targets)
        
    def __getitem__(self, idx):
        return self.features[idx], self.targets[idx]

train_loader = DataLoader(EmbeddingDataset(X_train, y_train), batch_size=128, shuffle=True)
val_loader = DataLoader(EmbeddingDataset(X_val, y_val), batch_size=128, shuffle=False)

# Define deep MLP classification head
class DeepClassifier(nn.Module):
    def __init__(self, input_dim=1280, num_classes=18):
        super().__init__()
        self.net = nn.Sequential(
            nn.Dropout(p=0.2),
            nn.Linear(input_dim, 512),
            nn.ReLU(),
            nn.Dropout(p=0.3),
            nn.Linear(512, 128),
            nn.ReLU(),
            nn.Dropout(p=0.2),
            nn.Linear(128, num_classes)
        )
        
    def forward(self, x):
        return self.net(x)

mlp = DeepClassifier(input_dim=1280, num_classes=len(class_names)).to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(mlp.parameters(), lr=0.001, weight_decay=1e-4)
scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=20, gamma=0.5)

# Train the MLP classifier
epochs = 60
print("Training the MLP classification head...")
for epoch in range(epochs):
    mlp.train()
    running_loss = 0.0
    correct = 0
    total = 0
    
    for feats, targets in train_loader:
        feats, targets = feats.to(device), targets.to(device)
        optimizer.zero_grad()
        outputs = mlp(feats)
        loss = criterion(outputs, targets)
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item() * feats.size(0)
        _, predicted = outputs.max(1)
        total += targets.size(0)
        correct += predicted.eq(targets).sum().item()
        
    scheduler.step()
    epoch_loss = running_loss / len(X_train)
    epoch_acc = 100. * correct / total
    
    # Validation loop
    mlp.eval()
    val_loss = 0.0
    val_correct = 0
    val_total = 0
    with torch.no_grad():
        for feats, targets in val_loader:
            feats, targets = feats.to(device), targets.to(device)
            outputs = mlp(feats)
            loss = criterion(outputs, targets)
            
            val_loss += loss.item() * feats.size(0)
            _, predicted = outputs.max(1)
            val_total += targets.size(0)
            val_correct += predicted.eq(targets).sum().item()
            
    val_epoch_loss = val_loss / len(X_val)
    val_acc = 100. * val_correct / val_total
    
    if (epoch + 1) % 10 == 0 or epoch == 0:
        print(f"Epoch {epoch+1}/{epochs} - Loss: {epoch_loss:.4f}, Acc: {epoch_acc:.2f}% | Val Loss: {val_epoch_loss:.4f}, Val Acc: {val_acc:.2f}%")

# Re-assemble complete MobileNetV2 with trained MLP classifier
print("Assembling final MobileNetV2 model...")
final_model = models.mobilenet_v2(pretrained=False)
final_model.classifier = mlp.net
# Note: we need to copy over the features weights from the pre-trained feature extractor
final_model.features.load_state_dict(feature_extractor.features.state_dict())
final_model.eval()

# Save final outputs
model_path = os.path.join(output_dir, "disease_model.pth")
classes_path = os.path.join(output_dir, "disease_classes.json")

torch.save(final_model.state_dict(), model_path)
with open(classes_path, "w") as f:
    json.dump({
        "classes": class_names
    }, f)

print(f"Model saved successfully to {model_path}")
print(f"Class names saved to {classes_path}")
