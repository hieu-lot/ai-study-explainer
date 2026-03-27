// Mock data for UI development. Replace with real API calls later.

// --- 30-page mock document ---
const topics = [
  "Neural networks have revolutionized artificial intelligence, enabling breakthroughs in computer vision, natural language processing, and reinforcement learning. This comprehensive review examines the theoretical foundations, architectural innovations, and practical applications that have shaped the modern deep learning landscape.\n\nThe concept of artificial neural networks dates back to the 1940s, when McCulloch and Pitts proposed a computational model of neural activity. However, it wasn't until the backpropagation algorithm and large-scale computing that neural networks became practically viable.",
  "A perceptron is the simplest form of a neural network — a single neuron that takes multiple binary inputs, applies weights, sums them, and produces a binary output through an activation function.\n\nMathematically, the output y = σ(Σ wᵢxᵢ + b), where σ is the activation function, wᵢ are weights, xᵢ are inputs, and b is the bias term. Despite its simplicity, the perceptron laid the groundwork for modern deep architectures.",
  "Backpropagation is the cornerstone of neural network training. It calculates the gradient of the loss function with respect to each weight by applying the chain rule iteratively from the output layer backward.\n\nThe algorithm proceeds in two phases: forward pass computes predictions, backward pass computes gradients. Stochastic gradient descent (SGD) then updates weights: w ← w − η ∂L/∂w, where η is the learning rate.",
  "Convolutional Neural Networks (CNNs) exploit spatial locality in data by using learnable filters that slide over the input. Each filter produces a feature map highlighting specific patterns like edges, textures, or shapes.\n\nKey components include convolutional layers, pooling layers (for downsampling), and fully connected layers for classification. Architectures like ResNet introduced skip connections to enable training of very deep networks (100+ layers).",
  "Recurrent Neural Networks (RNNs) are designed for sequential data. Unlike feedforward networks, RNNs maintain a hidden state that captures information from previous time steps, making them suitable for language modeling and time-series prediction.\n\nLong Short-Term Memory (LSTM) networks solve the vanishing gradient problem by introducing gating mechanisms: forget gate, input gate, and output gate, each learned independently.",
  "Transformer architectures replaced recurrence with self-attention mechanisms, allowing parallel processing of entire sequences. The key innovation is scaled dot-product attention: Attention(Q,K,V) = softmax(QKᵀ/√dₖ)V.\n\nMulti-head attention enables the model to attend to different representation subspaces simultaneously, capturing diverse linguistic relationships.",
  "Transfer learning leverages pre-trained models on large datasets and fine-tunes them for specific downstream tasks. This dramatically reduces the data and computation needed for new applications.\n\nModels like BERT (bidirectional) and GPT (autoregressive) demonstrated that pre-training on massive text corpora produces representations that transfer well across NLP tasks.",
  "Generative Adversarial Networks (GANs) consist of two competing networks: a generator creates synthetic data, while a discriminator distinguishes real from fake. Training proceeds as a minimax game: min_G max_D E[log D(x)] + E[log(1−D(G(z)))].\n\nVariants include StyleGAN for high-resolution image synthesis, CycleGAN for unpaired image translation, and Wasserstein GAN for more stable training dynamics.",
  "Regularization techniques prevent overfitting by adding constraints during training. Common methods include: Dropout (randomly zeroing activations), L1/L2 weight regularization, Batch Normalization (normalizing layer inputs), and Data Augmentation.\n\nEarly stopping monitors validation loss and halts training when performance degrades, effectively regularizing the model's capacity.",
  "Optimization algorithms determine how network weights are updated. Beyond vanilla SGD, modern optimizers include Adam (adaptive moment estimation), RMSProp (scaling by running average of gradients), and AdaGrad.\n\nLearning rate schedules — cosine annealing, warm-up strategies, cyclical rates — significantly impact convergence speed and final model quality.",
];

function generatePage(idx: number): string {
  if (idx < topics.length) return topics[idx];
  const section = idx - topics.length;
  const titles = ["Attention Mechanisms", "Embeddings & Representations", "Loss Functions", "Hyperparameter Tuning",
    "Model Interpretability", "Federated Learning", "Neural Architecture Search", "Quantization & Pruning",
    "Self-Supervised Learning", "Reinforcement Learning", "Vision Transformers", "Multi-Modal Models",
    "Diffusion Models", "Graph Neural Networks", "Ethical Considerations", "Deployment & MLOps",
    "Benchmarking Methodologies", "Scaling Laws", "Future Directions", "Conclusion"];
  const t = titles[section % titles.length];
  return `${t}\n\nThis section examines ${t.toLowerCase()} in the context of modern deep learning systems. Recent advances have demonstrated significant improvements in both efficiency and accuracy through novel architectural choices and training paradigms.\n\nKey findings indicate that careful application of these techniques can yield 15-30% improvement in task-specific benchmarks while reducing computational requirements by up to 40%. Further research directions include scalability analysis and cross-domain generalization studies.`;
}

export const mockDocument = {
  id: "paper-001",
  title: "Understanding Neural Networks: A Comprehensive Review",
  author: "Dr. Sarah Chen et al.",
  pages: Array.from({ length: 30 }, (_, i) => ({ pageNumber: i + 1, content: generatePage(i) })),
};

export const mockChatHistory = [
  { id: "1", role: "assistant" as const, content: "Welcome! I've analyzed this document. Select text to explain, or ask any question below.", citations: [] as { page: number; text: string }[] },
];

export const mockRecentDocs = [
  { id: "paper-001", title: "Neural Networks Review", pages: 30, lastOpened: "2 hours ago" },
  { id: "paper-002", title: "Quantum Computing Intro", pages: 15, lastOpened: "Yesterday" },
  { id: "paper-003", title: "Climate Change Report", pages: 42, lastOpened: "3 days ago" },
  { id: "paper-004", title: "Microeconomics Notes", pages: 8, lastOpened: "1 week ago" },
];

export const mockStats = [
  { icon: "flame", value: "7", label: "Day streak" },
  { icon: "cards", value: "142", label: "Cards reviewed" },
  { icon: "docs", value: "12", label: "Documents uploaded" },
];

export const mockDecks = [
  { id: "deck-1", name: "Biology 101", cardCount: 42, mastery: 68 },
  { id: "deck-2", name: "CS 201 — Algorithms", cardCount: 18, mastery: 85 },
  { id: "deck-3", name: "Neural Networks", cardCount: 24, mastery: 45 },
];

export const mockFlashcards = [
  { id: "fc-1", deckId: "deck-1", front: "What is the powerhouse of the cell?", back: "The mitochondria — organelles that generate most of the cell's ATP through oxidative phosphorylation." },
  { id: "fc-2", deckId: "deck-1", front: "What is the difference between mitosis and meiosis?", back: "Mitosis produces two identical diploid cells; meiosis produces four genetically unique haploid cells." },
  { id: "fc-3", deckId: "deck-2", front: "What is the time complexity of merge sort?", back: "O(n log n) in all cases — best, average, and worst." },
  { id: "fc-4", deckId: "deck-2", front: "Define Big-O notation.", back: "An upper bound on the growth rate of a function, describing worst-case time or space complexity." },
  { id: "fc-5", deckId: "deck-3", front: "What is backpropagation?", back: "An algorithm that calculates gradients of the loss function w.r.t. each weight using the chain rule, enabling gradient descent updates." },
  { id: "fc-6", deckId: "deck-3", front: "What problem do LSTMs solve?", back: "The vanishing gradient problem in standard RNNs, using gating mechanisms (forget, input, output gates)." },
];
