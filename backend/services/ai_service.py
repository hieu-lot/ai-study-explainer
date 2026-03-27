# =====================================
# MOCK AI MODE (NO EXTERNAL API)
# This is a temporary AI simulation layer
# Replace with real provider later
# Vietnamese-first UI with bilingual input
# =====================================

import logging
import random
from typing import Optional

logger = logging.getLogger(__name__)

# =====================================
# LANGUAGE DETECTION
# =====================================
VIETNAMESE_CHARS = set('ăâđêôơưàáảãạầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ')

def detect_language(text: str) -> str:
    """
    Detect if text contains Vietnamese.
    Returns: 'vi' for Vietnamese, 'en' for English
    """
    text_lower = text.lower()
    for char in text_lower:
        if char in VIETNAMESE_CHARS:
            return 'vi'
    return 'en'

# =====================================
# VIETNAMESE KNOWLEDGE BASE
# =====================================
VIETNAMESE_KNOWLEDGE_BASE = {
    "photosynthesis": {
        "beginner": {
            "answers": [
                "Quang hợp là quá trình các cây tạo ra chất dinh dưỡng bằng ánh sáng mặt trời. Nói đơn giản, cây là những nhà máy thực phẩm! Chúng sử dụng năng lượng từ mặt trời để biến nước và không khí thành đường (thức ăn) và oxy mà chúng ta hô hấp.",
                "Giống như những nhà máy thực phẩm nhỏ, cây sử dụng ánh sáng mặt trời để chuyển đổi nước và không khí thành đường và oxy. Đó là lý do tại sao cây có màu xanh và tại sao chúng ta có oxy để thở.",
            ],
            "summaries": [
                "Quên hợp là quá trình cây sử dụng ánh sáng mặt trời để tạo ra đường và oxy từ nước và CO2.",
                "Một quá trình tự nhiên nơi cây chuyển đổi năng lượng mặt trời thành thức ăn.",
            ],
            "key_points_list": [
                ["Cây cần ánh sáng mặt trời", "Nước được hấp thụ bởi rễ", "Oxy được giải phóng vào không khí"],
                ["Ánh sáng mặt trời cung cấp năng lượng", "Khí CO2 được lấy từ không khí", "Đường được sử dụng làm thức ăn của cây"],
            ],
        },
        "intermediate": {
            "answers": [
                "Quang hợp là quá trình chuyển hóa mà các cây chuyển đổi năng lượng ánh sáng thành năng lượng hóa học được lưu trữ trong glucose. Nó xảy ra ở hai giai đoạn: phản ứng phụ thuộc ánh sáng (xảy ra ở màng tylakoid) và phản ứng không phụ thuộc ánh sáng hoặc chu kỳ Calvin (xảy ra ở stroma). Phương trình: 6CO₂ + 6H₂O + năng lượng ánh sáng → C₆H₁₂O₆ + 6O₂",
                "Trong quang hợp, chlorophyll hấp thụ photon, kích thích các electron lên trạng thái năng lượng cao hơn. Năng lượng này thúc đẩy sản xuất ATP và NADPH thông qua các chuỗi vận chuyển electron. Chu kỳ Calvin sau đó sử dụng các hóa chất này để cố định CO₂ thành glucose.",
            ],
            "summaries": [
                "Quá trình hai giai đoạn chuyển đổi năng lượng ánh sáng thành năng lượng hóa học trong các phân tử glucose.",
                "Phản ứng ánh sáng tạo ra ATP và NADPH; chu kỳ Calvin cố định CO₂ thành glucose.",
            ],
            "key_points_list": [
                ["Phản ứng phụ thuộc ánh sáng ở tylakoid", "Phản ứng không phụ thuộc ánh sáng ở stroma", "Phương trình: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂"],
                ["Chlorophyll hấp thụ photon", "Chuỗi vận chuyển electron tạo ATP/NADPH", "RuBisCO xúc tác cố định CO₂"],
            ],
        },
        "advanced": {
            "answers": [
                "Quang hợp liên quan đến các phức hợp photosystem II và I trung gian vận chuyển electron thông qua phức hợp cytochrome b₆f. Dòng electron theo lược đồ Z tạo gradient proton cho ATP synthase. PSII xúc tác oxy hóa nước ở phức hợp thải oxy; PSI khử NADP⁺. Chu kỳ Calvin hoạt động với bước giới hạn tốc độ ở RuBisCO, nơi carbamoyl hóa của thặng dư lysine điều chỉnh hoạt động thông qua cơ chế phụ thuộc ánh sáng.",
                "Các hệ thống quang hợp tiên tiến hiển thị các thích nghi C4 và CAM tránh quang呼吸. Cây C4 tập trung CO₂ không gian thông qua con đường oxaloacetate; cây CAM tách rời CO₂ trong thời gian. Ức chế photon và quenching không phát sáng điều chỉnh tán xạ năng lượng.",
            ],
            "summaries": [
                "Các mạng vận chuyển electron phức tạp và các thích nghi chuyển hóa tối ưu hóa sử dụng ánh sáng và cố định CO₂.",
                "Chi tiết cơ học của lược đồ Z và các cơ chế điều chỉnh hiệu quả quang hợp.",
            ],
            "key_points_list": [
                ["Vận chuyển electron theo lược đồ Z", "PSII oxy hóa nước ở phức hợp thải oxy", "Gradient proton cho ATP synthase", "PSI khử NADP⁺"],
                ["Các con đường quang hợp C4 và CAM", "Quang呼吸và bảo vệ photon", "Điều chỉnh RuBisCO phụ thuộc thioredoxin", "Quenching phụ thuộc xanthophyll"],
            ],
        },
    },
    "machine learning": {
        "beginner": {
            "answers": [
                "Học máy là khi máy tính học từ các ví dụ thay vì được lập trình rõ ràng. Hãy tưởng tượng dạy một đứa trẻ nhận biết chó bằng cách cho xem nhiều hình ảnh chó - sau một thời gian, nó có thể nhận biết những con chó mới không bao giờ thấy. Máy tính hoạt động theo cách tương tự: chúng học các mẫu từ dữ liệu.",
                "Đó là trí tuệ nhân tạo cải thiện thông qua ví dụ. Thay vì một lập trình viên viết từng quy tắc, chương trình học các quy tắc bằng cách phân tích nhiều dữ liệu, tìm kiếm các mẫu, và cải thiện theo thời gian.",
            ],
            "summaries": [
                "Máy tính học các mẫu từ dữ liệu để đưa ra dự đoán mà không được lập trình rõ ràng.",
                "Một cách tiếp cận nơi các máy cải thiện hiệu suất của chúng thông qua kinh nghiệm và ví dụ.",
            ],
            "key_points_list": [
                ["Học từ dữ liệu thay vì quy tắc", "Nhận biết các mẫu", "Dự đoán trên dữ liệu mới"],
                ["Đào tạo với các ví dụ", "Cải thiện với kinh nghiệm", "Ra quyết định tự động"],
            ],
        },
        "intermediate": {
            "answers": [
                "Học máy liên quan đến việc tạo các mô hình học từ dữ liệu đào tạo thông qua các thuật toán tối ưu hóa như stochastic gradient descent. Học có giám sát sử dụng dữ liệu có nhãn cho phân loại/hồi quy; học không có giám sát xác định các mẫu mà không có nhãn. Hiệu suất mô hình được đánh giá bằng các số liệu như độ chính xác, precision, recall, và xác thực chéo ngăn chặn overfitting.",
                "Quá trình này liên quan đến kỹ thuật tính năng, điều chỉnh siêu tham số, và xác thực trên các tập kiểm tra. Các hàm mất mát (cross-entropy, MSE) hướng dẫn quá trình tối ưu hóa. Các kỹ thuật regularization (L1, L2, dropout) ngăn chặn overfitting. Các thuật toán phổ biến bao gồm cây quyết định, random forests, SVMs, mạng nơ-ron, và các phương pháp ensemble.",
            ],
            "summaries": [
                "Khung toán học sử dụng các thuật toán tối ưu hóa để phù hợp các mô hình với dữ liệu cho các nhiệm vụ dự đoán.",
                "Các cách tiếp cận có giám sát, không có giám sát, và học tăng cường với phương pháp xác thực kỹ lưỡng.",
            ],
            "key_points_list": [
                ["Học có giám sát vs không có giám sát", "Hàm mất mát và tối ưu hóa", "Xác thực chéo và tập kiểm tra", "Regularization ngăn chặn overfitting"],
                ["Kỹ thuật tính năng", "Điều chỉnh siêu tham số", "Các thuật toán phổ biến (cây, SVMs, NNs)", "Phương pháp ensemble"],
            ],
        },
        "advanced": {
            "answers": [
                "Học máy nâng cao liên quan đến các mạng nơ-ron sâu với lan truyền ngược qua nhiều lớp ẩn. Các kiến trúc tích chập (ResNets, DenseNets) tối ưu hóa trích xuất tính năng phân cấp. Các kiến trúc Transformer sử dụng cơ chế chú ý đa đầu cho mô hình hóa chuỗi. Các kỹ thuật như batch normalization, layer normalization, và kết nối dư thặng ổn định quá trình đào tạo.",
                "Các cách tiếp cận đương đại bao gồm meta-learning cho thích nghi few-shot, các xem xét về độ mạnh của đối thủ, và học liên kết. Các khung xác suất (Bayesian NNs, VAEs, diffusion models) định lượng sự không chắc chắn. Các phương pháp giải thích (attention visualization, SHAP values, saliency maps) cho phép hiểu mô hình.",
            ],
            "summaries": [
                "Học sâu với các kiến trúc specialized và cơ chế chú ý cho dữ liệu có cấu trúc phức tạp.",
                "Các mô hình xác suất và kỹ thuật giải thích cho các hệ thống ML mạnh mẽ, có thể giải thích.",
            ],
            "key_points_list": [
                ["Mạng nơ-ron sâu và lan truyền ngược", "CNNs và Transformers", "Batch/layer normalization", "Kết nối dư thặng"],
                ["Meta-learning và thích nghi few-shot", "Độ mạnh của đối thủ", "Học liên kết", "Định lượng sự không chắc chắn", "Giải thích (SHAP, attention)"],
            ],
        },
    },
}

# =====================================
# ENGLISH KNOWLEDGE BASE
# =====================================
ENGLISH_KNOWLEDGE_BASE = {
    "photosynthesis": {
        "beginner": {
            "answers": [
                "Photosynthesis is how plants make their own food using sunlight. It's like a plant's way of cooking a meal! Plants take in sunlight, water, and carbon dioxide from the air, and turn them into sugar (food) and oxygen that we breathe.",
                "Plants are basically little food factories! They use sunlight as energy to convert water and air into sugar and oxygen. It's the reason plants are green and why we have oxygen to breathe.",
            ],
            "summaries": [
                "Plants use sunlight to convert water and CO2 into sugar and oxygen.",
                "A process where plants capture sunlight energy to make food.",
            ],
            "key_points_list": [
                ["Plants need sunlight", "Water is absorbed by roots", "Oxygen is released into the air"],
                ["Sunlight provides energy", "Carbon dioxide is taken from air", "Sugar is used as plant food"],
            ],
        },
        "intermediate": {
            "answers": [
                "Photosynthesis is a metabolic process where plants convert light energy into chemical energy stored in glucose. It occurs in two stages: the light-dependent reactions (occurring in the thylakoid membrane) and the light-independent reactions or Calvin cycle (occurring in the stroma). The net equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂.",
                "In photosynthesis, chlorophyll absorbs photons, exciting electrons to a higher energy state. This energy drives ATP and NADPH production through electron transport chains. The Calvin cycle then uses these energy carriers to fix CO₂ into glucose through a series of enzymatic reactions involving RuBisCO.",
            ],
            "summaries": [
                "Two-stage process converting light energy to chemical energy in glucose molecules.",
                "Light reactions produce ATP and NADPH; Calvin cycle fixes CO₂ into glucose.",
            ],
            "key_points_list": [
                ["Light-dependent reactions in thylakoid", "Light-independent reactions in stroma", "Net equation: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂"],
                ["Chlorophyll absorbs photons", "Electron transport chains generate ATP/NADPH", "RuBisCO catalyzes CO₂ fixation"],
            ],
        },
        "advanced": {
            "answers": [
                "Photosynthesis involves photosystem II and photosystem I complexes mediating electron transport through the cytochrome b₆f complex. Z-scheme electron flow generates a proton gradient for ATP synthase. PSII catalyzes water oxidation at the oxygen-evolving complex; PSI reduces NADP⁺. The Calvin cycle operates with rate-limiting step at RuBisCO catalysis, where carbamoylation of lysine residues regulates activity via light-dependent thioredoxin mechanisms.",
                "Advanced photosynthetic systems show C4 and CAM adaptations circumventing photorespiration. C4 plants concentrate CO₂ spatially via oxaloacetate shuttle; CAM plants temporally separate CO₂ fixation. Photoinhibition and non-photochemical quenching regulate energy dissipation, with xanthophyll cycle operating in varying light conditions.",
            ],
            "summaries": [
                "Complex electron transport networks and metabolic adaptations optimize light utilization and CO₂ fixation.",
                "Mechanistic details of Z-scheme and regulatory mechanisms controlling photosynthetic efficiency.",
            ],
            "key_points_list": [
                ["Z-scheme electron transport", "PSII water oxidation at oxygen-evolving complex", "ATP synthase proton gradient", "NADP⁺ reduction at PSI"],
                ["C4 and CAM photosynthetic pathways", "Photorespiration and photoprotection", "Thioredoxin-mediated RuBisCO regulation", "Xanthophyll-dependent quenching"],
            ],
        },
    },
    "machine learning": {
        "beginner": {
            "answers": [
                "Machine learning is when computers learn from examples instead of being explicitly programmed. Imagine teaching a child to recognize dogs by showing them many dog pictures—after a while, they can identify new dogs they've never seen. Computers work the same way: they learn patterns from data.",
                "It's artificial intelligence that improves by example. Instead of a programmer writing every rule, the program learns the rules by analyzing lots of data, finding patterns, and getting better over time.",
            ],
            "summaries": [
                "Computers learn patterns from data to make predictions without being explicitly programmed.",
                "An approach where machines improve their performance through experience and examples.",
            ],
            "key_points_list": [
                ["Learning from data instead of rules", "Recognizing patterns", "Making predictions on new data"],
                ["Training with examples", "Improving with experience", "Automated decision-making"],
            ],
        },
        "intermediate": {
            "answers": [
                "Machine learning involves creating models that learn from training data through optimization algorithms like stochastic gradient descent. Supervised learning uses labeled data for classification/regression; unsupervised learning identifies patterns without labels; reinforcement learning optimizes through reward signals. Model performance is evaluated using metrics like accuracy, precision, recall, and cross-validation prevents overfitting.",
                "The process involves feature engineering, hyperparameter tuning, and validation on held-out test sets. Loss functions (cross-entropy, MSE) guide the optimization process. Regularization techniques (L1, L2, dropout) prevent overfitting. Popular algorithms include decision trees, random forests, SVMs, neural networks, and ensemble methods.",
            ],
            "summaries": [
                "Mathematical framework using optimization algorithms to fit models to data for prediction tasks.",
                "Supervised, unsupervised, and reinforcement approaches with rigorous validation methodology.",
            ],
            "key_points_list": [
                ["Supervised vs unsupervised learning", "Loss functions and optimization", "Cross-validation and test sets", "Regularization prevents overfitting"],
                ["Feature engineering", "Hyperparameter tuning", "Common algorithms (trees, SVMs, NNs)", "Ensemble methods"],
            ],
        },
        "advanced": {
            "answers": [
                "Advanced ML involves deep neural networks with backpropagation through multiple hidden layers. Convolutional architectures (ResNets, DenseNets) optimize hierarchical feature extraction. Transformer architectures utilize multi-head attention mechanisms for sequence modeling. Techniques like batch normalization, layer normalization, and residual connections stabilize training of deep models.",
                "Contemporary approaches include meta-learning for few-shot adaptation, adversarial robustness considerations, and federated learning for distributed data. Probabilistic frameworks (Bayesian NNs, VAEs, diffusion models) quantify uncertainty. Interpretability methods (attention visualization, SHAP values, saliency maps) enable model understanding in high-stakes applications.",
            ],
            "summaries": [
                "Deep learning with specialized architectures and attention mechanisms for complex structured data.",
                "Probabilistic models and interpretability techniques for robust, explainable ML systems.",
            ],
            "key_points_list": [
                ["Deep neural networks and backpropagation", "CNNs and Transformers", "Batch/layer normalization", "Residual connections"],
                ["Meta-learning and few-shot adaptation", "Adversarial robustness", "Federated learning", "Uncertainty quantification", "Interpretability (SHAP, attention)"],
            ],
        },
    },
    "quantum computing": {
        "beginner": {
            "answers": [
                "Quantum computers are super-powerful computers that use the strange rules of quantum physics. While regular computers use bits (0 or 1), quantum computers use 'qubits' that can be both 0 AND 1 at the same time! This lets them explore many possibilities at once, making them incredibly fast for certain problems.",
                "Unlike your laptop, quantum computers harness quantum mechanics to process information. They can solve certain problems exponentially faster than regular computers, though they're not good at everything—they excel at specific tasks like breaking encryption or simulating molecules.",
            ],
            "summaries": [
                "Computers leveraging quantum superposition and entanglement for exponential speedup on specific problems.",
                "Systems using qubits that exist in superposition, enabling parallel exploration of solution spaces.",
            ],
            "key_points_list": [
                ["Qubits can be 0 and 1 simultaneously", "Superposition enables parallel processing", "Much faster for specific problems"],
                ["Quantum superposition and entanglement", "Exponential speedup vs classical", "Best for cryptography and simulation"],
            ],
        },
        "intermediate": {
            "answers": [
                "Quantum computing exploits superposition where qubits exist in linear combinations of |0⟩ and |1⟩ states, and entanglement creating correlations between qubits. Quantum gates (Hadamard, CNOT, Toffoli) manipulate qubits. Measurement collapses superposition to classical states, introducing probabilistic outcomes. Key algorithms include Grover's search (quadratic speedup) and Shor's factoring (exponential speedup).",
                "Quantum circuits apply unitary transformations to quantum states. Phase kickback and interference amplify correct answers while canceling wrong ones. Decoherence and error rates limit current systems (NISQ era). Quantum error correction uses entangled qubits redundantly to preserve information despite noise.",
            ],
            "summaries": [
                "Physical systems implementing unitary transformations on superposed qubits via quantum gates.",
                "Algorithms leveraging interference and entanglement to achieve speedups over classical computation.",
            ],
            "key_points_list": [
                ["Superposition and entanglement", "Quantum gates and circuits", "Grover's and Shor's algorithms", "Measurement collapses superposition"],
                ["Phase kickback and interference", "Decoherence and NISQ era", "Quantum error correction", "Unitary transformations"],
            ],
        },
        "advanced": {
            "answers": [
                "Advanced quantum computing involves quantum error correction codes (surface codes, stabilizer codes) protecting logical qubits. Topological approaches use anyonic braiding for fault-tolerant gates. Variational quantum algorithms (VQE, QAOA) hybrid classical-quantum optimization. Tensor network methods and gauge theories describe quantum states. Quantum simulation efficiently models strongly-correlated systems.",
                "Contemporary frontier includes quantum supremacy demonstrations through random circuit sampling, quantum advantage for optimization (QAOA), and simulation of chemical systems. Quantum machine learning explores parameterized circuits for classification. Adiabatic quantum computation and quantum annealing approach optimization via ground state preparation.",
            ],
            "summaries": [
                "Fault-tolerant architectures and hybrid algorithms for near-term quantum advantage.",
                "Quantum supremacy demonstrations and specialized applications in optimization and simulation.",
            ],
            "key_points_list": [
                ["Stabilizer codes and surface codes", "Topological quantum computation", "Variational quantum algorithms", "Quantum error correction", "Fault tolerance"],
                ["Quantum supremacy and advantage", "VQE and QAOA", "Adiabatic quantum computing", "Quantum simulation", "Quantum machine learning"],
            ],
        },
    },
}

FLASHCARD_TEMPLATES = {
    "photosynthesis": [
        {
            "question": "What is the primary source of energy for photosynthesis?",
            "answer": "Sunlight (solar energy) is the primary energy source. Photons are captured by chlorophyll molecules in the light-dependent reactions.",
        },
        {
            "question": "Name the two main stages of photosynthesis.",
            "answer": "1) Light-dependent reactions (in thylakoid membranes) - produce ATP and NADPH\n2) Light-independent reactions/Calvin cycle (in stroma) - fix CO₂ into glucose",
        },
        {
            "question": "What gas is released as a byproduct of photosynthesis?",
            "answer": "Oxygen (O₂) is released, particularly from the water-splitting reaction in PSII during light-dependent reactions.",
        },
        {
            "question": "What is the role of chlorophyll in photosynthesis?",
            "answer": "Chlorophyll absorbs light photons, becoming excited and transferring energized electrons to the electron transport chain.",
        },
        {
            "question": "Where does the Calvin cycle occur?",
            "answer": "The Calvin cycle occurs in the stroma of the chloroplast, using ATP and NADPH from light reactions to fix CO₂.",
        },
    ],
    "machine learning": [
        {
            "question": "What is the main difference between supervised and unsupervised learning?",
            "answer": "Supervised learning uses labeled training data to learn input-output mappings; unsupervised learning finds patterns in unlabeled data.",
        },
        {
            "question": "What is overfitting in machine learning?",
            "answer": "Overfitting occurs when a model learns the training data too well, including noise, resulting in poor generalization to new data.",
        },
        {
            "question": "Name three common loss functions used in machine learning.",
            "answer": "1) Cross-entropy loss (classification)\n2) Mean Squared Error/MSE (regression)\n3) Binary cross-entropy (binary classification)",
        },
        {
            "question": "What is the purpose of cross-validation?",
            "answer": "Cross-validation assesses model performance on different data splits, preventing optimistic bias and detecting overfitting.",
        },
        {
            "question": "What does backpropagation do?",
            "answer": "Backpropagation computes gradients of the loss with respect to model parameters by chaining partial derivatives backward through the network.",
        },
    ],
    "quantum computing": [
        {
            "question": "What is a qubit?",
            "answer": "A qubit (quantum bit) is the basic unit of quantum information that can exist in a superposition of |0⟩ and |1⟩ states simultaneously.",
        },
        {
            "question": "What is quantum superposition?",
            "answer": "Superposition is the quantum property where a qubit exists in a linear combination of multiple states until measured, which collapses it to one state.",
        },
        {
            "question": "Explain quantum entanglement.",
            "answer": "Entanglement is a quantum correlation where two or more qubits are interdependent; measuring one instantly affects the others regardless of distance.",
        },
        {
            "question": "What is Shor's algorithm used for?",
            "answer": "Shor's algorithm efficiently factors large integers on a quantum computer, enabling exponential speedup for breaking RSA encryption.",
        },
        {
            "question": "What is the current era of quantum computing called?",
            "answer": "The NISQ era (Noisy Intermediate-Scale Quantum) describes current devices with 50-1000 qubits but high error rates.",
        },
    ],
}


def _get_topic_from_context(context: str, level: str = "beginner", kb: dict = None) -> tuple[str, bool]:
    """
    Infer topic from context. Falls back to default if not recognized.
    Returns (topic, found_in_kb)
    """
    if kb is None:
        kb = KNOWLEDGE_BASE
    context_lower = context.lower()
    for topic in kb.keys():
        if topic in context_lower:
            return topic, True
    return "general", False


async def ask(
    question: str,
    context: str = "",
    level: str = "beginner",
    document_id: Optional[str] = None,
) -> dict:
    """
    Simulate asking a question about a concept.
    Detects input language and always responds in Vietnamese.

    Args:
        question: The user's question (can be English or Vietnamese)
        context: Optional context (topic hint, document text, etc.)
        level: Explanation level - "beginner", "intermediate", or "advanced"
        document_id: Not used in mock mode, but kept for API compatibility

    Returns:
        dict with keys: answer, summary, key_points, difficulty, source
    """
    # Detect input language
    input_language = detect_language(question + " " + context)
    
    # Normalize level
    level = level.lower() if isinstance(level, str) else "beginner"
    if level not in VIETNAMESE_KNOWLEDGE_BASE.get(list(VIETNAMESE_KNOWLEDGE_BASE.keys())[0], {}).keys():
        level = "beginner"

    # Always use Vietnamese knowledge base for response
    kb = VIETNAMESE_KNOWLEDGE_BASE
    
    # Infer topic from context
    topic, found = _get_topic_from_context(question + " " + context, level, kb)

    # If topic is in knowledge base, use it
    if topic in kb and found:
        kb_entry = kb[topic][level]
        answer = random.choice(kb_entry["answers"])
        summary = random.choice(kb_entry["summaries"])
        key_points = random.choice(kb_entry["key_points_list"])
        
        # Add language hint if input was English
        if input_language == "en":
            answer = f"(Dựa trên câu hỏi tiếng Anh)\n\n{answer}"
    else:
        # Generic fallback response in Vietnamese
        generic_answers = {
            "beginner": "Đây là một câu hỏi tuyệt vời! Chủ đề bạn hỏi về là rất quan trọng để hiểu. Hãy yên tâm rằng nó có liên quan đến những khái niệm cơ bản mà chúng ta có thể giải thích một cách đơn giản. Sự quan trọng there là hiểu được mối quan hệ giữa các thành phần khác nhau. Hãy thực hành với các ví dụ, và các mẫu sẽ trở nên rõ ràng hơn.",
            "intermediate": "Câu hỏi này liên quan đến nhiều nguyên tắc liên kết với nhau. Mối quan hệ giữa các thành phần này có thể được hiểu thông qua một khung cơ cấu. Hãy xem xét các cơ chế cơ bản: chúng ta có thể phân tích điều này bằng cách sử dụng cả nền tảng lý thuyết và ứng dụng thực tiễn. Sự tương tác giữa các yếu tố này tạo nên hành vi bạn đang quan sát. Để hiểu sâu hơn, hãy kiểm tra các nghiên cứu trường hợp và kết quả thực nghiệm.",
            "advanced": "Câu hỏi của bạn đề cập đến một giao điểm phức tạp của các nguyên tắc với những hàm ý không tầm thường. Nền tảng lý thuyết liên quan đến các khung toán học nghiêm ngặt và xác thực thực nghiệm trên các hệ thống khác nhau. Hãy xem xét cơ chế cơ bản: các mô hình nâng cao kết hợp các tương tác bậc cao hơn và các tính chất nổi hiện. Kiểm tra kỹ lưỡng tiết lộ các điều kiện biên tinh tế và các trường hợp bệnh lý đáng được điều tra.",
        }
        answer = generic_answers.get(level, generic_answers["beginner"])
        
        # Add language hint if input was English
        if input_language == "en":
            answer = f"(Dựa trên câu hỏi tiếng Anh)\n\n{answer}"
        
        summary = "Một cái nhìn tổng quan khái niệm về chủ đề bạn hỏi."
        key_points = [
            "Hiểu khái niệm cơ bản",
            "Nhận biết các mẫu và kết nối",
            "Áp dụng kiến thức vào các tình huống mới",
        ]

    logger.info(f"Mock AI: answering in Vietnamese (input language: {input_language}), level={level}, topic={topic}")

    return {
        "answer": answer,
        "summary": summary,
        "key_points": key_points,
        "difficulty": level,
        "source": "mock-ai",
    }


async def generate_flashcards(source_text: str, count: int = 5, topic: str = "") -> list[dict]:
    """
    Generate realistic flashcard Q&A pairs from source text or topic.

    Args:
        source_text: Source material (may contain topic hints)
        count: Number of flashcards to generate (1-10)
        topic: Optional explicit topic specification

    Returns:
        list of dicts with keys: front (question), back (answer)
    """
    count = max(1, min(count, 10))  # Clamp between 1-10

    # Infer topic from source_text or explicit topic param
    inferred_topic, found = _get_topic_from_context(source_text + " " + topic)

    # If we found a topic with templates, use them
    if inferred_topic in FLASHCARD_TEMPLATES:
        templates = FLASHCARD_TEMPLATES[inferred_topic]
        selected = random.sample(templates, min(count, len(templates)))
        cards = [{"front": card["question"], "back": card["answer"]} for card in selected]
    else:
        # Generic fallback cards (still realistic structure)
        base_questions = [
            "What is the main concept discussed in this material?",
            "How do the key components interact?",
            "What are the practical applications of these principles?",
            "What are the fundamental assumptions underlying this theory?",
            "How can you distinguish between similar concepts from this topic?",
            "What are the limitations or edge cases of this approach?",
            "What evidence supports this concept?",
            "How does this relate to real-world scenarios?",
            "What would happen if one of these principles were violated?",
            "How can you remember the key terminology?",
        ]

        base_answers = [
            "The core concept revolves around the interconnected relationship between key elements and their systemic behavior.",
            "These components work together through a feedback loop where each influences the others in a coordinated manner.",
            "Real-world applications span multiple domains including industry, research, education, and problem-solving.",
            "This theory assumes that the basic principles are universal and can be tested under controlled conditions.",
            "The distinction lies in understanding the underlying mechanisms and recognizing when each applies.",
            "Important limitations include specific boundary conditions and scenarios where the simplified model breaks down.",
            "Empirical studies, theoretical models, and controlled experiments provide strong support for these principles.",
            "Consider how abstract concepts translate to concrete situations you encounter in daily life or professional work.",
            "Breaking a fundamental assumption would invalidate key predictions and require revising the entire framework.",
            "Using mnemonics, visual associations, and spaced repetition helps encode specialized terminology into long-term memory.",
        ]

        cards = []
        for i in range(count):
            q_idx = i % len(base_questions)
            a_idx = (i + random.randint(0, 5)) % len(base_answers)
            cards.append(
                {
                    "front": base_questions[q_idx],
                    "back": base_answers[a_idx],
                }
            )

    logger.info(
        f"Mock AI: generated {len(cards)} flashcards for topic={inferred_topic}"
    )

    return cards
