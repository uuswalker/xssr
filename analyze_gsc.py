import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

df_dates = pd.read_csv('gsc_dates.csv')
df_queries = pd.read_csv('gsc_queries.csv')

plt.style.use('dark_background')
sns.set_theme(style="darkgrid", rc={"axes.facecolor": "#0f172a", "figure.facecolor": "#0f172a", "text.color": "white", "axes.labelcolor": "white", "xtick.color": "white", "ytick.color": "white"})

artifact_dir = r"C:\Users\uuswalker\.gemini\antigravity\brain\50b300bf-229a-4fc2-964c-3356685de0ff"

# Plot 1: Time Series
df_dates['Date'] = pd.to_datetime(df_dates['Date'])
fig, ax1 = plt.subplots(figsize=(10, 5))
color = '#38bdf8'
ax1.set_xlabel('Date')
ax1.set_ylabel('Impressions', color=color)
ax1.plot(df_dates['Date'], df_dates['Impressions'], color=color, linewidth=2, marker='o')
ax1.tick_params(axis='y', labelcolor=color)

ax2 = ax1.twinx()  
color = '#22c55e'
ax2.set_ylabel('Clicks', color=color)  
ax2.plot(df_dates['Date'], df_dates['Clicks'], color=color, linewidth=2, marker='s', linestyle='--')
ax2.tick_params(axis='y', labelcolor=color)

plt.title('GSC Trend Analysis (Impressions vs Clicks)', color='white', pad=20)
fig.tight_layout()  
plt.savefig(os.path.join(artifact_dir, "gsc_trend.png"), dpi=150, bbox_inches='tight', transparent=True)
plt.close()

# Plot 2: Query Opportunity Scatter
df_q_filtered = df_queries[df_queries['Impressions'] > 5].copy()

plt.figure(figsize=(12, 6))
scatter = sns.scatterplot(
    data=df_q_filtered, 
    x='Position', 
    y='CTR', 
    size='Impressions', 
    sizes=(50, 1500), 
    alpha=0.7, 
    color='#f59e0b',
    edgecolor='white'
)

low_hanging = df_q_filtered[(df_q_filtered['Position'] > 4) & (df_q_filtered['Impressions'] > 20)]
for i in range(len(low_hanging)):
    plt.text(
        low_hanging['Position'].iloc[i] + 0.2, 
        low_hanging['CTR'].iloc[i] + 0.005, 
        low_hanging['Query'].iloc[i], 
        fontsize=10, 
        color='#cbd5e1',
        weight='bold'
    )

plt.title('Keyword Opportunity Matrix (Size = Impressions)', color='white', pad=20, fontsize=14)
plt.axvline(x=5, color='#ef4444', linestyle='--', alpha=0.8)
plt.text(5.2, df_q_filtered['CTR'].max() * 0.9, 'Target Area (Pos 5-15)\\nLow Hanging Fruits', color='#ef4444', fontsize=11, weight='bold')
plt.xlabel('Average Position')
plt.ylabel('Click-Through Rate (CTR)')
plt.tight_layout()
plt.savefig(os.path.join(artifact_dir, "gsc_opportunity.png"), dpi=150, bbox_inches='tight', transparent=True)
plt.close()

# Plot 3: Clustering (K-Means on Impressions vs Position)
from sklearn.cluster import KMeans
import numpy as np

features = df_q_filtered[['Impressions', 'Position']]
kmeans = KMeans(n_clusters=3, random_state=42, n_init=10).fit(features)
df_q_filtered['Cluster'] = kmeans.labels_

plt.figure(figsize=(10, 6))
sns.scatterplot(
    data=df_q_filtered,
    x='Position',
    y='Impressions',
    hue='Cluster',
    palette=['#3b82f6', '#ef4444', '#10b981'],
    s=150,
    alpha=0.8
)
plt.title('K-Means Keyword Clustering (Impression vs Position)', color='white', pad=20, fontsize=14)
plt.tight_layout()
plt.savefig(os.path.join(artifact_dir, "gsc_clusters.png"), dpi=150, bbox_inches='tight', transparent=True)
plt.close()

print("Plots generated successfully!")
