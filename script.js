let questions = [];
let currentQuestionIndex = 0;
let userEmail = "";
let usedHint = false;
let followUpAnswered = new Set();
let answeredQuestions = new Set(); // Stores indices of answered questions
let correctCount = 0;
let incorrectCount = 0;
let selectedSectionQuestions = []; // Holds questions for the currently selected section
let currentSessionId = ""; // To store a unique ID for the current quiz session

// Make sure this URL is correct and active for your Google Apps Script
const googleAppsScriptURL = "https://script.google.com/macros/s/AKfycbyhwDLRvLVO7YgwInO8Y29B9OrwZaUgTZ2lElvJMemouw3_o-2u83F-8HK2FhgiOAoCPQ/exec";
const sectionIntroMap = {
  1: `
  <h2>Subject-Verb Agreement</h2>

<h3>What is Subject-Verb Agreement?</h3>
<p><strong>ENGLISH:</strong> The subject is who or what does the action. The verb is the action. They have to match! Like teammates in basketball — they must play in sync.</p>
<p><strong>POLISH:</strong> Podmiot to osoba lub rzecz, która coś robi. Orzeczenie to czynność. Muszą do siebie pasować, jak gracz i piłka w drużynie!</p>

<h3>Deep Explanation:</h3>
<ul>
  <li>In English, a singular subject takes a singular verb, and a plural subject takes a plural verb.</li>
  <li><strong>Singular:</strong> He plays ✔ / He play ❌</li>
  <li><strong>Plural:</strong> They play ✔ / They plays ❌</li>
  <li>Watch out for words like <em>“everyone,” “each,” “neither,” “none”</em> — these look plural but are grammatically singular.</li>
  <li>Be careful when the subject is far from the verb — don’t get confused by other nouns in between!</li>
</ul>

<h3>English vs. Polish Differences:</h3>
<ul>
  <li>Polish verbs change based on endings (chodzę, chodzisz, chodzą), and subjects can often be dropped.</li>
  <li>English has simpler verb forms, but you must always include the subject, and matching is done with few endings (e.g., just adding 's' in 3rd person present).</li>
</ul>

<h3>Examples:</h3>
<ol>
  <li><strong>Each of the athletes has a scholarship.</strong><br />
    <em>ENGLISH EXPLANATION:</em> “Each” is singular, even though “athletes” is plural. So, we use <strong>has</strong>, the singular verb.
    Like: Each (one) has → not have. 
  </li>
  <li><strong>Neither the doctor nor the therapists were available.</strong><br />
    <em>ENGLISH EXPLANATION:</em> The verb agrees with the closest subject — <strong>therapists</strong> — so we use <strong>were</strong>.
  </li>
  <li><strong>My basketball skills have improved this year.</strong><br />
    <em>ENGLISH EXPLANATION:</em> “Skills” is plural → use <strong>have</strong>, not <em>has</em>.
  </li>
  <li><strong>Physiotherapy is a growing field.</strong><br />
    <em>ENGLISH EXPLANATION:</em> “Physiotherapy” is singular, so we use <strong>is</strong>.It looks like a big word but it's only one thing!
  </li>
  <li><strong>There are many ways to treat injuries.</strong><br />
    <em>ENGLISH EXPLANATION:</em> The true subject is <strong>ways</strong> (plural), not “there” → use <strong>are</strong>.
  </li>
</ol>

<h3>Some More Examples Related to Your Life:</h3>
<ol start="6">
  <li><strong>Coach gives us new drills every week.</strong><br />
    <em>ENGLISH EXPLANATION:</em> “Coach” is singular → use <strong>gives</strong> with <strong>s</strong>.
  </li>
  <li><strong>My teammates support me every day.</strong><br />
    <em>ENGLISH EXPLANATION:</em> “Teammates” is plural → use <strong>support</strong>(no s in plural verb).
  </li>
  <li><strong>The training sessions are intense.</strong><br />
    <em>ENGLISH EXPLANATION:</em> “Sessions” is plural → use <strong>are</strong>, not <em>is</em>.
  </li>
  <li><strong>The committee agrees on the proposal.</strong><br />
    <em>ENGLISH EXPLANATION:</em> In American English, “committee” is singular → use <strong>agrees</strong> not agree.⚠️ Watch out: In British English, collective nouns can be plural.

  </li>
  <li><strong>Neither the manager nor the employees know the answer.</strong><br />
    <em>ENGLISH EXPLANATION:</em> Closest subject is <strong>employees</strong> (plural) → use <strong>know</strong> not knows.
  </li>
  <li><strong>Each of the books contains valuable information.</strong><br />
    <em>ENGLISH EXPLANATION:</em> “Each” is always singular even if followed by a plural noun like “books.”→ use <strong>contains</strong>, not <em>contain</em>.
  </li>
  <li><strong>The number of applicants has increased this year.</strong><br />
    <em>ENGLISH EXPLANATION:</em> “The number of” is singular → use <strong>has increased</strong>  not have increased.
    ⚠️ Be careful — "A number of" is plural, but "The number of" is singular.
  </li>
  <li><strong>A number of students have submitted their essays.</strong><br />
    <em>ENGLISH EXPLANATION:</em> “A number of” means <bold>many</bold> is plural → use <strong>have</strong> not has.
  </li>
  <li><strong>There is a pencil and two books on the desk.</strong><br />
    <em>ENGLISH EXPLANATION:This is a tricky inversion</em> True subject is plural (“pencil and books”) → should be <strong>are</strong> not is.
    <br>But in spoken English, people often say it wrong.</br>
    <strong>Correct form:</strong>
    There are a pencil and two books on the desk.
  </li>
  <li><strong>Statistics is a challenging subject.</strong><br />
    <em>ENGLISH EXPLANATION:</em> “Statistics” looks plural, but here it refers to a single academic subject → use <strong>is</strong> (Singular).
  </li>
  <li><strong>The players, along with the coach, are celebrating the victory.</strong><br />
    <em>ENGLISH EXPLANATION:</em> Main subject is <strong>players</strong>The phrase “along with the coach” is extra and doesn’t affect the verb → use <strong>are</strong>.
  </li>
  <li><strong>Time and patience are needed to master this skill.</strong><br />
    <em>ENGLISH EXPLANATION:</em> Two nouns joined by “and” → use <strong>are</strong>form a plural subject. not is.
  </li>
  <li><strong>Each of the solutions fits the problem well.</strong><br />
    <em>ENGLISH EXPLANATION:</em> “Each” is singular → use <strong>fits</strong>not fit, even though “solutions” is plural.
  </li>
</ol>
  `,
  // NEW: Consolidated Section 2 for Sentence Structure
  2: `
    <h2>Sentence Structure</h2>

    <h2>📘 🏀 Mastering Sentence Structure: Your Playbook for SAT Success & College Basketball Dreams</h2>
    <h3>🧠 Cel lekcji: Zrozumieć różnicę między zdaniami poprawnymi, fragmentami zdań i błędami typu run-on (w tym comma splices), aby poprawić swoje wyniki na egzaminie SAT.</h3>

    <h2>🟩 PART 1: What is a Complete Sentence (Independent Clause)?</h2>
    <h3>✅ Co to jest pełne (poprawne) zdanie?</h3>
    <p>A complete sentence in English, also known as an independent clause, is the fundamental building block of clear and effective writing. It expresses a full idea and can stand alone as a sentence. To be complete, it must have three core components:</p>
    <ul>
        <li>✅ <strong>Subject (Podmiot):</strong> This is the noun or pronoun that performs the action or is described in the sentence. It answers the question "who?" or "what?" the sentence is about. The subject can be simple (e.g., She, car) or compound (e.g., John and Mary, The students and their teacher).</li>
        <li>✅ <strong>Verb (Czasownik):</strong> This is the action word or a state of being word. It tells what the subject is doing (runs, eats) or what is happening to the subject (is, seems). Verbs can be single words or verb phrases (e.g., will study, has been waiting).</li>
        <li>✅ <strong>A complete thought (Pełna myśl):</strong> This means the sentence makes sense on its own. It doesn't leave the reader waiting for more information or feeling like something is missing. It conveys a full idea.</li>
    </ul>

    <h4>🇺🇸 English Examples:</h4>
    <p><strong>She is studying for the test.</strong><br>
    ✔️ Subject: She (who is the sentence about?)<br>
    ✔️ Verb: is studying (what is she doing?)<<br>
    ✔️ Complete thought: This sentence makes perfect sense by itself.</p>
    <p><strong>The old car broke down on the highway.</strong><br>
    ✔️ Subject: The old car (a noun phrase acting as the subject)<br>
    ✔️ Verb: broke down (a phrasal verb indicating action)<br>
    ✔️ Complete thought: We understand the full event without needing more context.</p>
    <p><strong>The SAT is a challenging exam.</strong><br>
    ✔️ Subject: The SAT<br>
    ✔️ Verb: is (a state of being verb, linking the subject to its description)<br>
    ✔️ Complete thought: This is a complete statement about the SAT.</p>
    <p><strong>Many researchers around the world conduct experiments daily.</strong><br>
    ✔️ Subject: Many researchers around the world<br>
    ✔️ Verb: conduct<br>
    ✔️ Complete thought: A clear, self-contained statement.</p>
    <p><strong>SAT Connection:</strong> On the SAT Writing and Language section, identifying complete sentences is the first step in recognizing and correcting errors. Every correct answer choice for sentence structure questions will contain at least one independent clause.</p>

    <h4>🇵🇱 Polish Explanation:</h4>
    <p>Poprawne zdanie po angielsku, nazywane również klauzulą niezależną, to podstawowy element jasnego i skutecznego pisania. Wyraża ono pełną myśl i może samodzielnie stanowić zdanie. Aby było kompletne, musi zawierać trzy główne składniki:</p>
    <ul>
        <li>✅ <strong>Podmiot</strong> – rzeczownik lub zaimek, który wykonuje czynność lub jest opisywany w zdaniu. Odpowiada na pytanie „kto?” lub „co?” jest tematem zdania. Podmiot może być prosty (np. She, car) lub złożony (np. John and Mary, The students and their teacher).</li>
        <li>✅ <strong>Czasownik</strong> – słowo oznaczające czynność (runs, eats) lub stan bycia (is, seems). Czasowniki mogą być pojedynczymi słowami lub frazami czasownikowymi (np. will study, has been waiting).</li>
        <li>✅ <strong>Pełna myśl</strong> – oznacza, że zdanie ma sens samo w sobie. Nie pozostawia czytelnika w oczekiwaniu na więcej informacji ani poczucia, że czegoś brakuje. Przekazuje pełną ideę.</li>
    </ul>
    <p><strong>Przykłady:</strong></p>
    <p>She is studying for the test. (Ona uczy się do testu) — ✅ To pełne zdanie.</p>
    <p>The old car broke down on the highway. (Stary samochód zepsuł się na autostradzie.) — ✅ To pełne zdanie.</p>
    <p>The SAT is a challenging exam. (SAT to wymagający egzamin.) — ✅ To pełne zdanie.</p>
    <p>Many researchers around the world conduct experiments daily. (Wielu badaczy na całym świecie codziennie przeprowadza eksperymenty.) — ✅ To pełne zdanie.</p>

    <br>
    <hr>
    <br>

    <h2>🟥 PART 2: What is a Sentence Fragment?</h2>
    <h3>❌ Co to jest fragment zdania?</h3>
    <p>A sentence fragment is an incomplete sentence. It is a group of words that looks like a sentence (it might start with a capital letter and end with a period) but is missing one or more of the essential components of a complete sentence: a subject, a verb, or a complete thought. Fragments often leave the reader asking "What happened?" or "Who did that?" They create a choppy and unclear writing style.</p>

    <h4>Common Causes of Fragments:</h4>
    <p><strong>Missing Subject:</strong> The fragment describes an action but doesn't specify who or what is performing that action.<br>
    Example: ❌ Walked quickly to the library. (Who walked?)</p>
    <p><strong>Missing Verb:</strong> The fragment has a subject but no action or state of being verb.<br>
    Example: ❌ The tall, imposing building in the city center. (What about the building? What did it do or what was it?)</p>
    <p><strong>Dependent Clause Left Alone:</strong> A clause that begins with a subordinating conjunction (like because, although, when, if, since, while, unless, until, after, before, as, whereas) or a relative pronoun (who, which, that, whose, whom) is a dependent clause. It contains a subject and a verb, but it cannot stand alone because the introductory word makes it express an incomplete thought. It depends on an independent clause to make full sense.<br>
    Example: ❌ Because it was raining. (This dependent clause needs an independent clause, e.g., we stayed inside.)<br>
    Example: ❌ Which made the entire class laugh. (This relative clause needs to refer back to a noun in a main clause.)</p>
    <p><strong>Phrases Left Alone:</strong> Prepositional phrases, infinitive phrases, or participial phrases used as sentences are fragments.<br>
    Example: ❌ To finish the project on time. (Infinitive phrase. What happened to finish the project?)<br>
    Example: ❌ Sitting by the window, watching the snow fall. (Participial phrase. Who was sitting and watching?)</p>

    <h4>🇺🇸 English Examples (WRONG – fragments):</h4>
    <ul>
        <li>❌ Because it was raining. (Dependent clause. What happened because it was raining?)</li>
        <li>❌ Running to the bus. (Missing subject and part of the verb. Who was running?)</li>
        <li>❌ After school ended. (Dependent clause. What happened after school ended?)</li>
        <li>❌ The student, tired from studying all night. (Missing a main verb. What did the student do or was?)</li>
        <li>❌ Which made the entire class laugh. (Dependent clause. Needs a main clause to refer to.)</li>
        <li>❌ To prepare for the rigorous exam. (Infinitive phrase. What was done to prepare?)</li>
        <li>❌ Having completed all the assignments. (Participial phrase. Who completed them, and what happened next?)</li>
    </ul>
    <p><strong>SAT Connection:</strong> On the SAT, fragments are a common error type. They often appear as tempting but incorrect answer choices, especially those starting with because, which, who, or -ing words, if they are not properly connected to a main clause. Your task is to identify these incomplete ideas and choose the option that forms a grammatically complete and logical sentence.</p>

    <h4>🇵🇱 Polish Explanation:</h4>
    <p>Fragment zdania to niekompletne zdanie. Jest to grupa słów, która wygląda jak zdanie (może zaczynać się wielką literą i kończyć kropką), ale brakuje jej jednego lub więcej podstawowych elementów pełnego zdania: podmiotu, czasownika lub pełnej myśli. Fragmenty często sprawiają, że czytelnik zadaje pytania takie jak „Co się stało?” lub „Kto to zrobił?”. Tworzą one urywany i niejasny styl pisania.</p>
    <p><strong>Częste przyczyny fragmentów:</strong></p>
    <p><strong>Brak podmiotu:</strong> Fragment opisuje czynność, ale nie określa, kto lub co ją wykonuje.<br>
    Przykład: ❌ Walked quickly to the library. (Kto szedł?)</p>
    <p><strong>Brak czasownika:</strong> Fragment ma podmiot, ale nie ma czasownika oznaczającego czynność ani stan bycia.<br>
    Przykład: ❌ The tall, imposing building in the city center. (Co z tym budynkiem? Co zrobił lub jaki był?)</p>
    <p><strong>Samodzielna klauzula podrzędna:</strong> Klauzula, która zaczyna się od spójnika podrzędnego (np. because, although, when, if, since, while, unless, until, after, before, as, whereas) lub zaimka względnego (who, which, that, whose, whom), jest klauzulą podrzędną. Zawiera podmiot i czasownik, ale nie może samodzielnie stanowić zdania, ponieważ słowo wprowadzające sprawia, że wyraża niekompletną myśl. Zależy od klauzuli niezależnej, aby mieć pełny sens.<br>
    Przykład: ❌ Because it was raining. (Ta klauzula podrzędna potrzebuje klauzuli niezależnej, np. we stayed inside.)<br>
    Przykład: ❌ Which made the entire class laugh. (Ta klauzula względna musi odnosić się do rzeczownika w zdaniu głównym.)</p>
    <p><strong>Samodzielne frazy:</strong> Frazy przyimkowe, bezokolicznikowe lub imiesłowowe użyte jako zdania są fragmentami.<br>
    Przykład: ❌ To finish the project on time. (Fraza bezokolicznikowa. Co się stało, aby ukończyć projekt?)<br>
    Przykład: ❌ Sitting by the window, watching the snow fall. (Fraza imiesłowowa. Kto siedział i patrzył?)</p>

    <p><strong>Przykłady (złe):</strong></p>
    <ul>
        <li>❌ Because it was raining. (Ponieważ padało. → Ale co się stało?)</li>
        <li>❌ Running to the bus. (Biegnąc do autobusu. → Kto biegł? Co się stało?)</li>
        <li>❌ After school ended. (Po tym jak skończyła się szkoła. → Co wtedy?)</li>
        <li>❌ The student, tired from studying all night. (Uczeń, zmęczony nauką przez całą noc. → Ale co zrobił ten uczeń, albo jaki był?)</li>
        <li>❌ Which made the entire class laugh. (Co rozśmieszyło całą klasę. → Odnosi się do czegoś, ale brakuje głównego zdania.)</li>
        <li>❌ To prepare for the rigorous exam. (Aby przygotować się do rygorystycznego egzaminu. → Co zostało zrobione, aby się przygotować?)</li>
        <li>❌ Having completed all the assignments. (Po ukończeniu wszystkich zadań. → Kto je ukończył i co się stało potem?)</li>
    </ul>

    <h3>✅ How to Fix a Fragment:</h3>
    <p>To correct a fragment, you need to add the missing information (subject, verb) or, more commonly, connect the fragment to an existing independent clause to form a complete and coherent sentence.</p>
    <h4>Corrected Examples:</h4>
    <ul>
        <li>✅ Because it was raining, we stayed inside. (Added independent clause: we stayed inside) (Ponieważ padało, zostaliśmy w środku.)</li>
        <li>✅ She was running to the bus. (Added subject She and helping verb was) (Ona biegła do autobenu.)</li>
        <li>✅ After school ended, they went to the park. (Added independent clause: they went to the park) (Po lekcjach poszli do parku.)</li>
        <li>✅ The student, tired from studying all night, finally fell asleep. (Added verb fell asleep to complete the thought about the student) (Uczeń, zmęczony nauką przez całą noc, w końcu zasnął.)</li>
        <li>✅ The comedian told a joke, which made the entire class laugh. (Connected the dependent clause to the independent clause The comedian told a joke) (Komik opowiedział dowcip, co rozśmieszyło całą klasę.)</li>
        <li>✅ Students studied diligently to prepare for the rigorous exam. (Integrated the infinitive phrase into a complete sentence) (Studenci pilnie uczyli się, aby przygotować się do rygorystycznego egzaminu.)</li>
        <li>✅ Having completed all the assignments, the team celebrated their success. (Connected the participial phrase to an independent clause) (Po ukończeniu wszystkich zadań, zespół świętował swój sukces.)</li>
    </ul>

    <br>
    <hr>
    <br>

    <h2>🟧 PART 3: What is a Run-On Sentence? (and Comma Splice)</h2>
    <h3>❌ Co to jest run-on sentence? (i comma splice)</h3>
    <p>A run-on sentence occurs when two or more independent clauses (complete sentences) are joined together without proper punctuation or connecting words. The ideas are "run together" into one long, confusing sentence, making it difficult for the reader to follow the intended meaning. This error is also known as a fused sentence.</p>
    <p>A comma splice is a specific and very common type of run-on sentence. It happens when two independent clauses are incorrectly joined only by a comma. While a comma indicates a pause, it is not strong enough on its own to separate two complete thoughts that could stand as separate sentences. It creates a weak and grammatically incorrect connection.</p>
    <h4>Key Characteristics:</h4>
    <ul>
        <li>Two or more independent clauses.</li>
        <li>No punctuation between them (run-on/fused sentence).</li>
        <li>Only a comma between them (comma splice).</li>
    </ul>

    <h4>🇺🇸 English Examples:</h4>
    <ul>
        <li>❌ <strong>Run-on (Fused Sentence):</strong> I like pizza it is my favorite food.<br>
            Independent Clause 1: I like pizza<br>
            Independent Clause 2: it is my favorite food<br>
            Problem: No punctuation or conjunction separating them.</li>
        <li>❌ <strong>Comma Splice:</strong> He studies hard, he wants to pass.<br>
            Independent Clause 1: He studies hard<br>
            Independent Clause 2: he wants to pass<br>
            Problem: Only a comma is used to join two independent clauses.</li>
        <li>❌ <strong>Run-on (Fused Sentence):</strong> We went to the store we bought milk we also got some bread.<br>
            Independent Clause 1: We went to the store<br>
            Independent Clause 2: we bought milk<br>
            Independent Clause 3: we also got some bread<br>
            Problem: Multiple independent clauses without proper separation.</li>
        <li>❌ <strong>Comma Splice:</strong> The experiment failed, the results were inconclusive.<br>
            Independent Clause 1: The experiment failed<br>
            Independent Clause 2: the results were inconclusive<br>
            Problem: A comma alone is insufficient.</li>
        <li>❌ <strong>SAT-Style Comma Splice:</strong> The new software promised to streamline operations, however, many users found it difficult to navigate.<br>
            Independent Clause 1: The new software promised to streamline operations<br>
            Independent Clause 2: many users found it difficult to navigate<br>
            Problem: however is a conjunctive adverb, not a coordinating conjunction, so it cannot join two independent clauses with only a comma. It requires a semicolon before it, or a period.</li>
    </ul>
    <p><strong>SAT Connection:</strong> The SAT Writing and Language section heavily tests your ability to identify and correct run-on sentences and comma splices. These errors often appear in passages where sentences are long or complex, and the test asks you to choose the most grammatically correct and concise way to combine or separate ideas. Pay close attention to the relationship between clauses and the punctuation used.</p>

    <h4>🇵🇱 Polish Explanation:</h4>
    <p>Run-on sentence występuje, gdy dwie lub więcej klauzul niezależnych (pełnych zdań) jest połączonych bez odpowiedniej interpunkcji lub słów łączących. Idee są „zlane” ze sobą w jedno długie, mylące zdanie, co utrudnia czytelnikowi zrozumienie zamierzonego znaczenia. Ten błąd jest również znany jako zdanie zlane (fused sentence).</p>
    <p>Comma splice to specyficzny i bardzo powszechny rodzaj błędu typu run-on. Dzieje się tak, gdy dwie klauzule niezależne są niepoprawnie połączone tylko przecinkiem. Chociaż przecinek wskazuje na pauzę, sam w sobie nie jest wystarczająco silny, aby oddzielić dwie pełne myśli, które mogłyby stanowić oddzielne zdania. Tworzy to słabe i gramatycznie niepoprawne połączenie.</p>
    <p><strong>Główne cechy:</strong></p>
    <ul>
        <li>Dwie lub więcej klauzul niezależnych.</li>
        <li>Brak interpunkcji między nimi (run-on/fused sentence).</li>
        <li>Tylko przecinek między nimi (comma splice).</li>
    </ul>
    <p><strong>Przykłady (złe):</strong></p>
    <ul>
        <li>❌ <strong>Run-on (Fused Sentence):</strong> I like pizza it is my favorite food.<br>
            Klauzula niezależna 1: I like pizza<br>
            Klauzula niezależna 2: it is my favorite food<br>
            Problem: Brak interpunkcji lub spójnika, które by je rozdzielały.</li>
        <li>❌ <strong>Comma Splice:</strong> He studies hard, he wants to pass.<br>
            Klauzula niezależna 1: He studies hard<br>
            Klauzula niezależna 2: he wants to pass<br>
            Problem: Tylko przecinek jest użyty do połączenia dwóch klauzul niezależnych.</li>
        <li>❌ <strong>Run-on (Fused Sentence):</strong> We went to the store we bought milk we also got some bread.<br>
            Klauzula niezależna 1: We went to the store<br>
            Klauzula niezależna 2: we bought milk<br>
            Klauzula niezależna 3: we also got some bread<br>
            Problem: Wiele klauzul niezależnych bez odpowiedniego rozdzielenia.</li>
        <li>❌ <strong>Comma Splice:</strong> The experiment failed, the results were inconclusive.<br>
            Klauzula niezależna 1: The experiment failed<br>
            Klauzula niezależna 2: the results were inconclusive<br>
            Problem: Sam przecinek jest niewystarczający.</li>
        <li>❌ <strong>Comma Splice (w stylu SAT):</strong> The new software promised to streamline operations, however, many users found it difficult to navigate.<br>
            Klauzula niezależna 1: The new software promised to streamline operations<br>
            Klauzula niezależna 2: many users found it difficult to navigate<br>
            Problem: however jest przysłówkiem spójnikowym (conjunctive adverb), a nie spójnikiem współrzędnym (coordinating conjunction), więc nie może łączyć dwóch klauzul niezależnych tylko przecinkiem. Wymaga średnika przed nim lub kropki.</li>
    </ul>

    <br>
    <hr>
    <br>

    <h2>✅ PART 4: How to Fix a Run-On Sentence</h2>
    <h3>✅ Jak poprawić run-on sentence?</h3>
    <p>There are several effective ways to correct run-on sentences and comma splices. Choosing the best method often depends on the relationship between the ideas in the independent clauses and the desired emphasis.</p>

    <h3>🔧 METHOD 1: Use a period (.)</h3>
    <p>The simplest way to fix a run-on is to separate the two independent clauses into two distinct sentences. This is best when the ideas are related but not so closely that they absolutely need to be in the same sentence. It creates clear, concise sentences.</p>
    <ul>
        <li>❌ I like pizza it is my favorite.</li>
        <li>✅ I like pizza. It is my favorite.</li>
    </ul>
    <p><strong>SAT Example:</strong></p>
    <ul>
        <li>❌ The author presented many facts the argument remained unconvincing.</li>
        <li>✅ The author presented many facts. The argument remained unconvincing. (Two distinct points, clearly separated.)</li>
    </ul>

    <h3>🔧 METHOD 2: Use a semicolon (;)</h3>
    <p>A semicolon can be used to join two independent clauses that are closely related in meaning. Both clauses must be able to stand alone as complete sentences. The semicolon suggests a stronger connection than a period but a weaker one than a comma with a coordinating conjunction. It implies that the two ideas are linked conceptually.</p>
    <ul>
        <li>✅ I like pizza; it is my favorite food.</li>
    </ul>
    <p><strong>SAT Example:</strong></p>
    <ul>
        <li>❌ The research was extensive, it revealed new insights. (Comma splice)</li>
        <li>✅ The research was extensive; it revealed new insights. (The second clause directly elaborates on the first.)</li>
    </ul>
    <p><strong>Another SAT Example:</strong></p>
    <ul>
        <li>❌ The team practiced for months, their dedication was evident.</li>
        <li>✅ The team practiced for months; their dedication was evident.</li>
    </ul>

    <h3>🔧 METHOD 3: Use a comma + coordinating conjunction (FANBOYS)</h3>
    <p>Coordinating conjunctions (FANBOYS: For, And, Nor, But, Or, Yet, So) can connect two independent clauses. A comma must precede the coordinating conjunction. This method is excellent for showing the specific relationship between the two ideas (addition, contrast, cause, effect, etc.).</p>
    <ul>
        <li><strong>For</strong> (reason, 'because')</li>
        <li><strong>And</strong> (addition)</li>
        <li><strong>Nor</strong> (negative alternative, used with 'neither' or 'not')</li>
        <li><strong>But</strong> (contrast)</li>
        <li><strong>Or</strong> (choice, alternative)</li>
        <li><strong>Yet</strong> (contrast, similar to 'but', often stronger)</li>
        <li><strong>So</strong> (result, consequence)</li>
    </ul>
    <ul>
        <li>✅ I like pizza, and it is my favorite food.</li>
    </ul>
    <p><strong>SAT Example:</strong></p>
    <ul>
        <li>❌ Many students struggled with the essay they eventually improved. (Run-on)</li>
        <li>✅ Many students struggled with the essay, but they eventually improved. (The but clearly shows a contrast between struggling and improving.)</li>
    </ul>
    <p><strong>Another SAT Example:</strong></p>
    <ul>
        <li>❌ The new policy was implemented the budget increased.</li>
        <li>✅ The new policy was implemented, so the budget increased. (The so indicates a cause-and-effect relationship.)</li>
    </ul>

    <h3>🔧 METHOD 4: Use a subordinating conjunction</h3>
    <p>Subordinating conjunctions introduce a dependent clause and connect it to an independent clause. This method is used when one idea is less important or dependent on the other.</p>
    <p>When the dependent clause comes first, it is followed by a comma before the independent clause.<br>
    ✅ Because I like pizza, I eat it often.</p>
    <p>When the independent clause comes first, no comma is usually needed before the subordinating conjunction.<br>
    ✅ I eat pizza often because I like it.</p>
    <p><strong>Common Subordinating Conjunctions:</strong> because, although, when, since, if, while, unless, until, after, before, as, whereas, even though, in order that, though.</p>
    <p><strong>SAT Example:</strong></p>
    <ul>
        <li>❌ The data was clear, the hypothesis was disproven. (Comma splice)</li>
        <li>✅ Although the data was clear, the hypothesis was disproven. (The although shows a concession, meaning despite the clear data, the hypothesis was still disproven.)</li>
    </ul>
    <p><strong>Another SAT Example:</strong></p>
    <ul>
        <li>❌ The committee reviewed the proposal they made several revisions.</li>
        <li>✅ After the committee reviewed the proposal, they made several revisions. (The after clearly establishes a time sequence.)</li>
        <li>✅ The committee made several revisions because they reviewed the proposal. (The because establishes a reason.)</li>
    </ul>

    <br>
    <hr>
    <br>

    <h2>Summary Charts & Strategy Callouts</h2>
    <h3>✅ Summary Chart: Sentence Structures</h3>
    <table style="width:100%; border-collapse: collapse;">
        <thead>
            <tr>
                <th style="border: 1px solid black; padding: 8px;">Term</th>
                <th style="border: 1px solid black; padding: 8px;">Definition</th>
                <th style="border: 1px solid black; padding: 8px;">Example</th>
                <th style="border: 1px solid black; padding: 8px;">Is It Correct?</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">Independent Clause</td>
                <td style="border: 1px solid black; padding: 8px;">Complete sentence with subject + verb + complete thought</td>
                <td style="border: 1px solid black; padding: 8px;">The dog barked.</td>
                <td style="border: 1px solid black; padding: 8px;">✅ YES</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">Dependent Clause</td>
                <td style="border: 1px solid black; padding: 8px;">Begins with a subordinating word; cannot stand alone</td>
                <td style="border: 1px solid black; padding: 8px;">Because the dog barked</td>
                <td style="border: 1px solid black; padding: 8px;">❌ NO (needs main clause)</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">Fragment</td>
                <td style="border: 1px solid black; padding: 8px;">Missing subject, verb, or complete thought</td>
                <td style="border: 1px solid black; padding: 8px;">While running through the woods.</td>
                <td style="border: 1px solid black; padding: 8px;">❌ NO</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">Run-On (Fused)</td>
                <td style="border: 1px solid black; padding: 8px;">Two independent clauses without punctuation</td>
                <td style="border: 1px solid black; padding: 8px;">She was tired she fell asleep.</td>
                <td style="border: 1px solid black; padding: 8px;">❌ NO</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">Comma Splice</td>
                <td style="border: 1px solid black; padding: 8px;">Two independent clauses joined with just a comma</td>
                <td style="border: 1px solid black; padding: 8px;">I studied hard, I passed.</td>
                <td style="border: 1px solid black; padding: 8px;">❌ NO</td>
            </tr>
        </tbody>
    </table>

    <h3>🚨 Strategy Callouts (Test-Taking Tips)</h3>
    <ul>
        <li>🚨 <strong>Strategy 1: Watch for "Because," "Although," "Which," "Who," etc.</strong><br>
            These words often begin dependent clauses. If there's no full sentence before or after, it's likely a fragment.</li>
        <li>🚨 <strong>Strategy 2: Read the sentence out loud</strong><br>
            Fragments and run-ons usually “sound” wrong when read naturally. If a sentence feels like it abruptly ends or keeps going too long without pause, check the structure.</li>
        <li>🚨 <strong>Strategy 3: Use the "I see a comma" test</strong><br>
            If you spot a comma between two full sentences, it may be a comma splice. Either add a coordinating conjunction or use a semicolon/period.</li>
        <li>🚨 <strong>Strategy 4: Break it down</strong><br>
            When unsure, divide the sentence into clauses. Does each have a subject + verb and make complete sense? If not, revise!</li>
    </ul>
`,
  // Section 6 is now Section 3
  3:`
    <h1>🏀 Pronoun Agreement:</h1>
    <p>Imagine you're on the basketball court. Everyone on your team needs to work together, right? If one player is supposed to pass the ball, they need to send it to the right teammate. Pronouns in English work the same way: they need to match the word they are replacing.</p>
    <p>In grammar, this is called pronoun agreement — and it’s one of the most commonly tested concepts on the SAT.</p>

    <h3>🔤 What Is a Pronoun?</h3>
    <p>A pronoun is a small word used instead of a noun (a person, place, thing, or idea), to avoid repetition.</p>
    <p><strong>Example:</strong></p>
    <p>Instead of:</p>
    <p>"LeBron James is a great player. LeBron James scores many points."</p>
    <p>Use:</p>
    <p>"LeBron James is a great player. He scores many points."</p>
    <p>(He replaces "LeBron James".)</p>

    <h3>🧠 Why Does Pronoun Agreement Matter?</h3>
    <p>Because the SAT is testing whether you can write and read clearly. If a pronoun doesn't match the noun it's replacing — in number or gender — it confuses the reader.</p>

    <h3>📚 Types of Pronouns</h3>
    <ul>
        <li>✅ <strong>Singular Pronouns</strong> (refer to one person or thing):<br>
            I, you, he, she, it, me, him, her, my, his, her, its, myself, himself, herself, each, everyone, anyone, no one, someone, etc.</li>
        <li>✅ <strong>Plural Pronouns</strong> (refer to more than one):<br>
            we, you, they, us, them, our, their, themselves, both, many, few, several, others</li>
    </ul>

    <h3>🏆 The Golden Rule of Pronoun Agreement</h3>
    <p>A pronoun must agree with its antecedent — the noun it refers to — in:</p>
    <ul>
        <li>Number (singular or plural)</li>
        <li>Gender (masculine, feminine, neutral)</li>
    </ul>

    <h3>🇵🇱 Polish vs. English: Key Differences in Pronoun Agreement</h3>
    <p>Understanding the differences between Polish and English grammar helps you avoid common SAT mistakes.</p>
    
    <h4>1. Gender Is Marked Differently</h4>
    <p>In Polish, nouns have grammatical gender and endings change based on case, number, and gender. You're used to this.</p>
    <ul>
        <li>student → on (he)</li>
        <li>książka → ona (she/it)</li>
        <li>dziecko → ono (it)</li>
    </ul>
    <p>In English, gender is:</p>
    <ul>
        <li>Biological for people (he, she)</li>
        <li>Neutral for objects or animals (it)</li>
    </ul>
    <p>But nouns don’t change form — you have to think about number/gender rather than see it in the endings.</p>

    <h4>2. Number Confusion: The Most Common Mistake</h4>
    <p>Polish endings often make number very clear:</p>
    <ul>
        <li>Każdy uczeń zrobił swoje zadanie (singular)</li>
        <li>Wszyscy uczniowie oddali swoje prace (plural)</li>
    </ul>
    <p>In English, nouns often look the same in singular/plural and pronoun number mistakes happen easily.</p>
    <p>Common mistake (even among fluent Polish speakers):</p>
    <p>"Each student must bring their book." ❌ (Incorrect on SAT)</p>
    <p>Correct SAT version:</p>
    <p>"Each student must bring his or her book." ✅<br>
    Or rephrase:<br>
    "All students must bring their books."</p>

    <h4>3. Indefinite Pronouns: Singular in English, Even if They Sound Plural</h4>
    <p>Words like everyone, each, anyone feel plural but are singular in English grammar.</p>
    <p>Wrong (common error):</p>
    <p>"Everyone raised their hands." ❌</p>
    <p>Right:</p>
    <p>"Everyone raised his or her hand." ✅<br>
    Or rephrase:<br>
    "All students raised their hands."</p>

    <h3>🔁 Summary Table</h3>
    <table style="width:100%; border-collapse: collapse;">
        <thead>
            <tr>
                <th style="border: 1px solid black; padding: 8px;">Feature</th>
                <th style="border: 1px solid black; padding: 8px;">Polish</th>
                <th style="border: 1px solid black; padding: 8px;">English</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">Noun Gender</td>
                <td style="border: 1px solid black; padding: 8px;">Every noun has gender</td>
                <td style="border: 1px solid black; padding: 8px;">Only personal pronouns reflect gender</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">Pronoun Number Marking</td>
                <td style="border: 1px solid black; padding: 8px;">Clear in verb/pronoun endings</td>
                <td style="border: 1px solid black; padding: 8px;">Must think carefully (no visual cues)</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">Indefinite Pronouns</td>
                <td style="border: 1px solid black; padding: 8px;">Behave more intuitively</td>
                <td style="border: 1px solid black; padding: 8px;">Often singular even when they sound plural</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">Common Mistake</td>
                <td style="border: 1px solid black; padding: 8px;">Using “their” with singular nouns</td>
                <td style="border: 1px solid black; padding: 8px;">SAT penalizes this; fix or rephrase</td>
            </tr>
        </tbody>
    </table>

    <h3>🧪 SAT-Specific Pronoun Agreement Rules & Tricky Cases</h3>
    
    <h4>✅ Rule 1: Singular Antecedents Need Singular Pronouns</h4>
    <p>Wrong:<br>"Every player must bring their shoes." ❌</p>
    <p>Right:<br>"Every player must bring his or her shoes." ✅<br>Or better:<br>"All players must bring their shoes." ✅</p>
    <p>Tip: On the SAT, avoid "their" when the subject is each, every, someone, everyone, etc.</p>

    <h4>✅ Rule 2: Plural Antecedents Need Plural Pronouns</h4>
    <p>Wrong:<br>"The coaches told his team to hustle." ❌</p>
    <p>Right:<br>"The coaches told their team to hustle." ✅</p>
    <p>Wrong:<br>"The books were dusty, so I threw it away." ❌</p>
    <p>Right:<br>"The books were dusty, so I threw them away." ✅</p>

    <h4>✅ Rule 3: Indefinite Pronouns (The Sneaky Ones!)</h4>
    <p><strong>Always Singular:</strong><br>
    everyone, someone, nobody, anybody, each, either, neither, much, one, another<br>
    "Each of the players brought his or her shoes." ✅</p>
    <p><strong>Always Plural:</strong><br>
    both, few, many, several, others<br>
    "Many of the athletes forgot their jerseys." ✅</p>
    <p><strong>Singular or Plural (depends on noun):</strong><br>
    some, any, most, none, all<br>
    "Some of the juice lost its flavor." (juice = singular)<br>
    "Some of the players forgot their shoes." (players = plural)</p>

    <h4>✅ Rule 4: Collective Nouns</h4>
    <p>These refer to a group that may act as one unit or as individuals.</p>
    <p>Singular if acting as a unit:<br>"The team celebrated its win." ✅</p>
    <p>Plural if acting as individuals:<br>"The team wore their new sneakers." ✅</p>
    <p>SAT Tip: When in doubt, treat collective nouns like team, class, committee as singular unless the sentence clearly shows individuals acting separately.</p>
    
    <h4>✅ Rule 5: Compound Antecedents</h4>
    <p>If joined by "and" → Use plural pronouns:<br>"The coach and the assistant gave their instructions." ✅</p>
    <p>If joined by "or"/"nor" → Pronoun agrees with the closest noun:<br>"Neither the coach nor the players shared their strategy." ✅<br>
    "Neither the players nor the coach shared his strategy." ✅</p>

    <h3>📝 How This Is Tested on the SAT</h3>
    <p>You’ll see sentences with an underlined pronoun, and be asked:</p>
    <ul>
        <li>Is it correct?</li>
        <li>Which version fits best?</li>
    </ul>

    <h3>📌 Example 1 — Identify the Error:</h3>
    <p>"Each student needs to complete their assignment."</p>
    <p>Options:<br>
    A. their<br>
    B. his or her<br>
    C. his<br>
    D. its<br>
    E. No error</p>
    <p>✅ Correct Answer: B (because “Each student” is singular)</p>

    <h3>📌 Example 2 — Complete the Sentence:</h3>
    <p>"Neither the captain nor the forwards could make _____ passes."</p>
    <p>A. his<br>
    B. their<br>
    C. its<br>
    D. one's</p>
    <p>✅ Correct Answer: B (closest noun is “forwards,” which is plural → use their)</p>

    <h3>🧠 Final Tips to Master Pronoun Agreement</h3>
    <ul>
        <li>✅ Find the antecedent – What noun is the pronoun replacing?</li>
        <li>✅ Decide if it’s singular or plural</li>
        <li>✅ Check for gender – he/she/it/they</li>
        <li>✅ Memorize the tricky indefinite pronouns</li>
        <li>✅ Know how “and,” “or,” and “nor” affect agreement</li>
        <li>✅ Rephrase when possible to avoid awkward constructions</li>
        <li>✅ Practice! — Do lots of SAT drills until you see patterns</li>
    </ul>

    <h3>🏀 Your Basketball Dream & Good Grammar</h3>
    <p>To succeed in Division 1 basketball, you need more than skills on the court — you need communication and academic strength. Writing clearly with proper pronoun agreement shows discipline, focus, and professionalism.</p>
    <ul>
        <li>✅ Good Pronoun Agreement:<br>
        Like a perfect assist — smooth, accurate, team-focused.</li>
        <li>❌ Bad Pronoun Agreement:<br>
        Like a turnover — sloppy, confusing, and it costs you points.</li>
    </ul>

    <hr>

    <h2>🏀 Pronouns in Action: A Basketball Journey</h2>
    <p>🎯 Goal: Understand and use correct pronoun agreement and pronoun case in real-world and SAT-style situations — without boring drills!</p>

    <h3>🏆 CHAPTER 1: The Pronoun Game Plan</h3>
    <p>Coach's Talk: "A good team works together. So do nouns and pronouns. Let’s make sure they’re matching up correctly!"</p>

    <h4>🔹 Rule 1: Singular Antecedents</h4>
    <p>🏀 Story Moment:<br>
    You're watching your teammate Damian warming up. Each player brings his or her basketball.</p>
    <p>➡️ Why? Because each = one person → singular → his or her</p>
    <p>✅ Quick Shot:<br>
    Which sentence sounds right?<br>
    A. Every player must bring their shoes.<br>
    B. Every player must bring his or her shoes.</p>
    <p>🟢 Correct: B (SAT prefers clear agreement.)</p>

    <h4>🔹 Rule 2: Plural Antecedents</h4>
    <p>👟 After the game, the players cleaned their shoes.</p>
    <p>✔️ Players = plural → their (plural pronoun)</p>
    <p>✅ Real Talk:<br>
    You and your teammates know: They bring their own energy.</p>

    <h4>🔹 Rule 3: Indefinite Pronouns</h4>
    <p>🤔 Some words sound like a crowd, but they're singular.</p>
    <p>🧠 Think:<br>
    Someone, everyone, each → his or her</p>
    <p>Both, few, many → their</p>
    <p>🔈 Locker Room Chat:<br>
    Coach says: “Someone forgot his or her jersey.”<br>
    But: “Both of the guards improved their 3-point shooting.”</p>
    <p>✅ Quick Timeout:<br>
    Which sentence is correct?<br>
    A. Everyone must remember their role.<br>
    B. Everyone must remember his or her role.</p>
    <p>🟢 SAT answer: B</p>

    <h4>🔹 Rule 4: Collective Nouns</h4>
    <p>🏀 The team plays as one: “The team won its game.”</p>
    <p>👥 The team acts individually: “The team wore their new shoes.”</p>
    <p>🗣️ Coach’s Call:<br>
    “The committee announced its decision.”<br>
    “The committee shared their personal reasons.”</p>

    <h4>🔹 Rule 5: Compound Antecedents</h4>
    <p>"And" = plural<br>
    "Or/Nor" = look at the last noun</p>
    <p>🎙️ Interview Time:<br>
    "The coach and the captain shared their strategy."</p>
    <p>But:<br>
    “Neither the guards nor the center forgot his jersey.”<br>
    “Neither the center nor the guards forgot their jerseys.”</p>

    <h2>🏀 CHAPTER 2: Positioning Your Pronouns — Pronoun Case</h2>
    <p>🎯 Just like positions on the court, pronouns have roles.</p>

    <h4>🔹 Subject Pronouns</h4>
    <p>➡️ I, you, he, she, it, we, they, who<br>
    They score the points!</p>
    <p>Example: He dunked the ball.</p>

    <h4>🔹 Object Pronouns</h4>
    <p>➡️ me, you, him, her, it, us, them, whom<br>
    They receive the action.</p>
    <p>Example: Coach gave him the playbook.</p>

    <h4>🔹 Possessive Pronouns</h4>
    <p>➡️ my/mine, your/yours, his, her/hers, its, our/ours, their/theirs, whose<br>
    They show ownership.</p>
    <p>Example: That’s her ball. Those shoes are mine.</p>

    <h4>🔹 Preposition Rule</h4>
    <p>After words like to, for, with, between → use object pronouns</p>
    <p>🧠 Think: “Pass the ball to him,” not “to he.”</p>
    <p>Example: There's chemistry between the captain and her.</p>

    <h4>🔹 Linking Verbs</h4>
    <p>“Be” verbs (is, are, was...) → use subject pronouns</p>
    <p>🏀 Example:<br>
    “The best shooter was he.”<br>
    (Think: “He was the best shooter.”)</p>

    <h4>🔹 Comparisons</h4>
    <p>🟢 "Faster than he (is)."<br>
    🔴 Not: "Faster than him." (unless implied object)</p>
    <p>SAT loves implied verbs!</p>
    <p>🏀 Example:<br>
    “You dribble better than I (do).”</p>

    <h4>🔹 Appositives</h4>
    <p>When renaming a subject, use subject case.</p>
    <p>📣 Announcer says:<br>
    “The winners, Sarah and I, celebrated after the buzzer.”</p>

    <h4>🔹 Pronouns + Gerunds</h4>
    <p>🏀 Their shooting improved.</p>
    <p>🟢 Correct: "their" complaining, his running, our practicing</p>
    
    <h4>🔹 Consistency with “One”</h4>
    <p>🧠 Always follow “one” with one/one’s</p>
    <p>📣 "When one trains daily, one improves."</p>

    <h2>🏀 CHAPTER 3: Avoiding Turnovers — Vague Pronouns</h2>
    <p>Pronouns are like passes. A good pass always hits the right player!</p>

    <h4>🔹 Ambiguous “He,” “She,” “They”</h4>
    <p>🗯️ Bad Pass: “When the guard passed to the forward, he shot the ball.”<br>
    ➡️ Who shot?</p>
    <p>✅ Good Pass: “When the guard passed to the forward, the forward shot the ball.”</p>

    <h4>🔹 Vague “This,” “That,” “Which”</h4>
    <p>⚠️ Problem: “The team lost the lead, which upset the fans.”<br>
    ➡️ What upset them?</p>
    <p>✅ Clear: “Losing the lead upset the fans.”</p>

    <h4>🔹 Unclear “It” or “They”</h4>
    <p>🚫 “At the tournament, they said we could play.”<br>
    ➡️ Who’s they?</p>
    <p>✅ Better: “At the tournament, the organizers said we could play.”</p>
    `,
    // Section 7 is now Section 4
    4:`
    <h2>📘 🏀 Mastering Verb Tense: Your Playbook for SAT Success & College Basketball Dreams</h2>
    <p>Imagine you're on the basketball court. Every move—whether it's a pass, dribble, or shot—happens at a specific time. Did you pass the ball a moment ago? Are you dribbling right now? Will you shoot soon?</p>
    <p>Just like in basketball, English uses verb tenses to show when actions happen. Understanding verb tense is like knowing the game clock: it helps you stay in control of the sentence and score points on the SAT Writing and Language section. Mastering this will help you both in the test room and on the court as you chase your dream of playing college basketball in the USA.</p>

    <h3>🔤 What Is Verb Tense?</h3>
    <p>Verb tense shows the time of an action or a state of being. It tells us whether something happened in the past, is happening now, or will happen in the future.</p>
    <p>🏀 <strong>Example:</strong></p>
    <ul>
        <li>Past: Yesterday, I practiced my free throws.</li>
        <li>Present: Right now, I am practicing my dribbling.</li>
        <li>Future: Tomorrow, I will practice my jump shot.</li>
    </ul>

    <h2>📚 1. Key Tenses for SAT Success</h2>
    <p>The SAT focuses on a few core verb tenses. Think of these like your playbook moves—you need to know when to use which one.</p>

    <h3>🏀 1. Simple Present Tense</h3>
    <p><strong>Form:</strong> Base verb (add -s or -es for he/she/it)</p>
    <p><strong>Examples:</strong></p>
    <ul>
        <li>I play, You play, He/She plays, We play, They play</li>
    </ul>
    <p><strong>When to Use It (like a consistent dribble):</strong></p>
    <ul>
        <li>Habits/Routines: I wake up early every day to train.</li>
        <li>Facts/General Truths: The sun rises in the east.</li>
        <li>Scheduled Future Events: Our flight leaves at 8 AM tomorrow.</li>
    </ul>
    <p>🇵🇱 <strong>Polish Tip:</strong> Similar to niedokonany (imperfective) aspect — e.g., Ja gram w koszykówkę (I play basketball).</p>

    <h3>🏀 2. Simple Past Tense</h3>
    <p><strong>Form:</strong></p>
    <ul>
        <li>Regular: verb + -ed (e.g., play → played)</li>
        <li>Irregular: memorize! (e.g., go → went, run → ran)</li>
    </ul>
    <p><strong>When to Use It (like a completed shot):</strong></p>
    <ul>
        <li>Completed Actions in the Past:
            <ul>
                <li>We won the game last night.</li>
                <li>I finished my homework before practice.</li>
            </ul>
        </li>
    </ul>
    <p>🇵🇱 <strong>Polish Tip:</strong> Very similar to Polish past tense — Ja grałem / grałam (I played).</p>

    <h3>🏀 3. Simple Future Tense</h3>
    <p><strong>Form:</strong> will + base verb</p>
    <p><strong>When to Use It (like future strategy):</strong></p>
    <ul>
        <li>Planned/Expected Future Actions:
            <ul>
                <li>I will study for the SAT after practice.</li>
                <li>We will travel to the tournament next month.</li>
            </ul>
        </li>
    </ul>
    <p>🇵🇱 <strong>Polish Tip:</strong> Similar to będę + verb — Będę grał / grała.</p>

    <h3>🏀 4. Present Perfect Tense</h3>
    <p><strong>Form:</strong></p>
    <ul>
        <li>have/has + past participle</li>
        <li>Regular verbs: same as simple past (played)</li>
        <li>Irregular: go → gone, eat → eaten</li>
    </ul>
    <p><strong>When to Use It (like skills you’ve developed):</strong></p>
    <ul>
        <li>Actions that started in the past and continue now:
            <ul>
                <li>I have played basketball since I was six.</li>
                <li>She has lived here for five years.</li>
            </ul>
        </li>
        <li>Past experiences relevant now:
            <ul>
                <li>I have seen that movie before.</li>
                <li>Our team has won many games this season.</li>
            </ul>
        </li>
    </ul>
    <p>🇵🇱 <strong>Polish Tip:</strong> This is tricky! Polish doesn’t have a present perfect tense. You often use past tense (Zjadłem obiad), but in English:</p>
    <ul>
        <li>If it affects the present: I have eaten</li>
        <li>If it’s finished in the past: I ate</li>
    </ul>

    <h3>🏀 5. Past Perfect Tense</h3>
    <p><strong>Form:</strong> had + past participle</p>
    <p><strong>When to Use It (like reviewing an earlier play):</strong></p>
    <ul>
        <li>Action completed before another past action:
            <ul>
                <li>By the time the coach arrived, we had started warming up.</li>
                <li>I had never visited the USA before I came for college.</li>
            </ul>
        </li>
    </ul>
    <p>🇵🇱 <strong>Polish Tip:</strong> Use for the “earlier past” — two actions in the past, the one that happened first uses past perfect.</p>

    <h3>🏀 6. Progressive Tenses (Quick Guide)</h3>
    <p>These tenses show ongoing actions.</p>
    <table style="width:100%; border-collapse: collapse;">
        <thead>
            <tr>
                <th style="border: 1px solid black; padding: 8px;">Tense</th>
                <th style="border: 1px solid black; padding: 8px;">Form</th>
                <th style="border: 1px solid black; padding: 8px;">Example</th>
                <th style="border: 1px solid black; padding: 8px;">Use</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">Present Progressive</td>
                <td style="border: 1px solid black; padding: 8px;">am/is/are + verb-ing</td>
                <td style="border: 1px solid black; padding: 8px;">I am studying for the SAT.</td>
                <td style="border: 1px solid black; padding: 8px;">Action happening now</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">Past Progressive</td>
                <td style="border: 1px solid black; padding: 8px;">was/were + verb-ing</td>
                <td style="border: 1px solid black; padding: 8px;">I was sleeping when the phone rang.</td>
                <td style="border: 1px solid black; padding: 8px;">Ongoing past action</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">Future Progressive</td>
                <td style="border: 1px solid black; padding: 8px;">will be + verb-ing</td>
                <td style="border: 1px solid black; padding: 8px;">I will be practicing tomorrow at 3.</td>
                <td style="border: 1px solid black; padding: 8px;">Future action in progress</td>
            </tr>
        </tbody>
    </table>

    <h2>🏆 2. SAT-Specific Verb Tense Rules</h2>
    
    <h3>🧩 Rule 1: Consistency (Sequence of Tenses)</h3>
    <p>Keep tenses consistent unless there’s a reason to change.</p>
    <ul>
        <li>✅ Correct: When the referee blew the whistle, the game stopped.</li>
        <li>❌ Incorrect: When the referee blew the whistle, the game stops.</li>
        <li>✅ Correct (with a reason): My coach taught me that hard work is essential. (General truth stays in present.)</li>
    </ul>

    <h3>🧩 Rule 2: Time Markers = Clues to Tense</h3>
    <table style="width:100%; border-collapse: collapse;">
        <thead>
            <tr>
                <th style="border: 1px solid black; padding: 8px;">Time Marker</th>
                <th style="border: 1px solid black; padding: 8px;">Common Tense</th>
                <th style="border: 1px solid black; padding: 8px;">Example</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">yesterday, ago, last year</td>
                <td style="border: 1px solid black; padding: 8px;">Simple Past</td>
                <td style="border: 1px solid black; padding: 8px;">We won the championship last year.</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">now, currently</td>
                <td style="border: 1px solid black; padding: 8px;">Present Progressive</td>
                <td style="border: 1px solid black; padding: 8px;">I am dribbling now.</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">every day, always</td>
                <td style="border: 1px solid black; padding: 8px;">Simple Present</td>
                <td style="border: 1px solid black; padding: 8px;">Our team practices every day.</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">tomorrow, next week</td>
                <td style="border: 1px solid black; padding: 8px;">Simple Future</td>
                <td style="border: 1px solid black; padding: 8px;">We will play next week.</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">since, for</td>
                <td style="border: 1px solid black; padding: 8px;">Present Perfect</td>
                <td style="border: 1px solid black; padding: 8px;">I have trained since childhood.</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">by the time, before</td>
                <td style="border: 1px solid black; padding: 8px;">Past Perfect</td>
                <td style="border: 1px solid black; padding: 8px;">They had won before I joined the team.</td>
            </tr>
        </tbody>
    </table>

    <h3>🧩 Rule 3: Conditional Sentences (If/Then)</h3>
    <table style="width:100%; border-collapse: collapse;">
        <thead>
            <tr>
                <th style="border: 1px solid black; padding: 8px;">Type</th>
                <th style="border: 1px solid black; padding: 8px;">Structure</th>
                <th style="border: 1px solid black; padding: 8px;">Example</th>
                <th style="border: 1px solid black; padding: 8px;">Use</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">Type 1: Real</td>
                <td style="border: 1px solid black; padding: 8px;">If + Present, will + Base Verb</td>
                <td style="border: 1px solid black; padding: 8px;">If I train, I will improve.</td>
                <td style="border: 1px solid black; padding: 8px;">Real future possibility</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">Type 2: Unreal Present</td>
                <td style="border: 1px solid black; padding: 8px;">If + Past, would + Base Verb</td>
                <td style="border: 1px solid black; padding: 8px;">If I were taller, I would dunk.</td>
                <td style="border: 1px solid black; padding: 8px;">Hypothetical now</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">Type 3: Unreal Past</td>
                <td style="border: 1px solid black; padding: 8px;">If + Past Perfect, would have + Past Participle</td>
                <td style="border: 1px solid black; padding: 8px;">If I had trained harder, I would have made the team.</td>
                <td style="border: 1px solid black; padding: 8px;">Hypothetical past</td>
            </tr>
        </tbody>
    </table>
    <p>Note: Always use “were” for all subjects in Type 2 hypothetical clauses: If I were, If he were...</p>

    <h3>🧩 Rule 4: Verbs of Thinking or Believing</h3>
    <p>The tense of the verb inside the sentence usually matches the tense of the reporting verb.</p>
    <ul>
        <li>She believed the team was ready. (Past + Past)</li>
        <li>He thinks practice is important. (Present + Present)</li>
    </ul>

    <h2>🇵🇱 3. Polish vs. English: Key Tense Differences</h2>
    <table style="width:100%; border-collapse: collapse;">
        <thead>
            <tr>
                <th style="border: 1px solid black; padding: 8px;">Challenge</th>
                <th style="border: 1px solid black; padding: 8px;">Polish Example</th>
                <th style="border: 1px solid black; padding: 8px;">Common Mistake</th>
                <th style="border: 1px solid black; padding: 8px;">Correct English</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">Present Perfect</td>
                <td style="border: 1px solid black; padding: 8px;">Zjadłem obiad.</td>
                <td style="border: 1px solid black; padding: 8px;">I ate (instead of: I have eaten).</td>
                <td style="border: 1px solid black; padding: 8px;">I have eaten (if time not specified or result matters)</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">Habitual Actions</td>
                <td style="border: 1px solid black; padding: 8px;">Czytam książkę.</td>
                <td style="border: 1px solid black; padding: 8px;">I am reading (used for habitual).</td>
                <td style="border: 1px solid black; padding: 8px;">I read books (Simple Present)</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;">Perfective Aspect</td>
                <td style="border: 1px solid black; padding: 8px;">Przeczytam książkę.</td>
                <td style="border: 1px solid black; padding: 8px;">I will read (confusing Future Perfect).</td>
                <td style="border: 1px solid black; padding: 8px;">I will have read the book.</td>
            </tr>
        </tbody>
    </table>

    <h2>📝 4. How the SAT Tests Verb Tense</h2>
    <p>You may be asked to:</p>
    <ul>
        <li>✅ Fix tense consistency errors</li>
        <li>🔍 Choose the correct tense based on time markers</li>
        <li>🔁 Correct improper switching between tenses</li>
        <li>❓ Use the right structure in if/then sentences</li>
        <li>📊 Recognize the difference between past vs. present perfect</li>
    </ul>

    <h2>🧠 5. Final Tips: Play to Win</h2>
    <ul>
        <li>🏀 <strong>Read Like a Player Studies Film:</strong><br>
            News articles, sports reports, and academic texts help build tense awareness.</li>
        <li>⏱ <strong>Find the Time Markers:</strong><br>
            Words like yesterday, now, since help you choose the correct tense.</li>
        <li>📏 <strong>Check for Consistency:</strong><br>
            Don’t switch tenses mid-sentence unless there’s a logical reason.</li>
        <li>📚 <strong>Master Irregular Verbs:</strong><br>
            No shortcuts here—memorize key forms (go/went/gone, eat/ate/eaten, etc.).</li>
        <li>📈 <strong>Drill with SAT Practice:</strong><br>
            Do tense-focused questions regularly to build muscle memory.</li>
    </ul>

    <h2>🎯 6. Conclusion: Your Game, Your Grammar</h2>
    <p>To be a great basketball player, you need to know when to pass, when to shoot, and when to defend. To be a great English writer—and ace the SAT—you need to know when to use which tense. Your dream of college basketball in the USA depends not only on your jump shot but also on your ability to express yourself clearly and confidently.</p>
    <p>So practice your grammar like you practice your free throws—and success will follow.</p>
`
};

document.addEventListener("DOMContentLoaded", () => {
  fetch("questions.json")
    .then(res => res.json())
    .then(data => {
      questions = data; // Load all questions initially
      showSectionList();
    })
    .catch(err => console.error("Failed to load questions.json:", err));

  document.getElementById("startButton").addEventListener("click", () => {
    userEmail = document.getElementById("emailInput").value.trim();
    if (userEmail && userEmail.includes("@")) {
      currentSessionId = Date.now().toString(); // Generate a unique session ID (e.g., timestamp)
      
      document.getElementById("emailScreen").style.display = "none";
      if (selectedSectionQuestions.length > 0) {
        showQuestion(currentQuestionIndex);
      } else {
        alert("No questions found for this section. Please select a section first.");
        document.getElementById("emailScreen").style.display = "none";
        document.getElementById("home").style.display = "block";
      }
    } else {
      alert("Please enter a valid Gmail address.");
    }
  });

  document.getElementById("showHint").addEventListener("click", () => {
    // Corrected to use selectedSectionQuestions and check if answered
    if (selectedSectionQuestions.length > 0 && !answeredQuestions.has(currentQuestionIndex)) {
      const q = selectedSectionQuestions[currentQuestionIndex];
      document.getElementById("hintBox").innerText = q.hint || "";
      document.getElementById("hintBox").classList.add("hint-box");
      usedHint = true;
    }
  });

  document.getElementById("prevButton").addEventListener("click", () => {
    // Corrected to use selectedSectionQuestions
    if (selectedSectionQuestions.length > 0 && !answeredQuestions.has(currentQuestionIndex) && currentQuestionIndex > 0) {
        markQuestionAsSkipped(currentQuestionIndex);
    }
    if (currentQuestionIndex > 0) {
      showQuestion(--currentQuestionIndex);
    }
  });

  document.getElementById("nextButton").addEventListener("click", () => {
    // Corrected to use selectedSectionQuestions
    if (selectedSectionQuestions.length > 0 && !answeredQuestions.has(currentQuestionIndex)) {
        markQuestionAsSkipped(currentQuestionIndex);
    }

    if (currentQuestionIndex < selectedSectionQuestions.length - 1) { // Check against selectedSectionQuestions length
      showQuestion(++currentQuestionIndex);
    } else {
      showScore();
    }
  });
});

function showSectionList() {
  const sectionContainer = document.getElementById("sectionList");
  // Ensure uniqueSections are derived from the full 'questions' array
  const uniqueSections = [...new Set(questions.map(q => q.section))].sort((a, b) => a - b);

  const sectionNames = {
    1: "Subject-Verb Agreement",
    2: "Sentence Structure", // Consolidated sections 2,3,4,5 into 2.
    3: "Pronoun Agreement", // Section 6 is now Section 3
    4: "Verb Tense" // Section 7 is now Section 4
    // Section 8 has been removed as requested.
  };

  sectionContainer.innerHTML = "";
  uniqueSections.forEach(section => {
    // Only display buttons for sections that have intro content defined (1, 2, 3, 4)
    if (sectionIntroMap[section]) {
        const btn = document.createElement("button");
        btn.className = "section-button";
        btn.innerText = sectionNames[section] || `Section ${section}`; // Use defined name or default
        btn.onclick = () => {
            // Filter questions for the selected section. For section 2, include original sections 2,3,4,5
            if (section === 2) {
                // This is the core change: filter for questions from original sections 2, 3, 4, 5
                selectedSectionQuestions = questions.filter(q => q.section >= 2 && q.section <= 5);
                // Ensure we have between 20 and 25 questions for this combined section
                // This is a simple slice to get roughly 20-25. You might want a more sophisticated selection
                // if specific sub-topics *must* be included.
                selectedSectionQuestions = selectedSectionQuestions.slice(0, 25); // Limit to first 25
            } else {
                // For other sections, filter by the new section number (1, 3, 4)
                selectedSectionQuestions = questions.filter(q => q.section === section);
            }
            currentQuestionIndex = 0;
            answeredQuestions.clear();
            correctCount = 0;
            incorrectCount = 0;
            usedHint = false; // Reset hint usage for new section
            followUpAnswered.clear();
            
            selectedSectionQuestions.forEach(q => {
                delete q.userSelectedAnswer;
                delete q.wasCorrectLastTime;
                delete q.lastFeedbackText;
                delete q.followUpNeeded;
                delete q.followUpAnsweredThisTime;
                delete q.lastFollowUpFeedbackText;
                delete q.lastFollowUpAnswerWasCorrect;
                delete q.userSelectedFollowUpAnswer;
                q.startTime = null; 
                q.endTime = null;
            });
            const introContent = sectionIntroMap[section];
            document.getElementById("home").style.display = "none";
            if (introContent) {
                document.getElementById("introScreen").innerHTML = introContent + `<br><button id="continueToEmail">Take the Quiz</button>`;
                document.getElementById("introScreen").style.display = "block";
                document.getElementById("continueToEmail").addEventListener("click", () => {
                    document.getElementById("introScreen").style.display = "none";
                    document.getElementById("emailScreen").style.display = "block";
                });
            } else {
                document.getElementById("emailScreen").style.display = "block";
            }
        };
        sectionContainer.appendChild(btn);
    }
  });
}

function showQuestion(index) {
  // Use selectedSectionQuestions for current question logic
  const q = selectedSectionQuestions[index];
  if (!q) { // Handle case where question might not exist (e.g., end of quiz)
    showScore();
    return;
  }

  usedHint = false; // Reset for each question load
  q.startTime = new Date();

  document.getElementById("emailScreen").style.display = "none";
  document.getElementById("scoreScreen").style.display = "none";
  document.getElementById("questionScreen").style.display = "block";

  document.getElementById("questionNumber").innerText = `Question ${index + 1} of ${selectedSectionQuestions.length}`;
  document.getElementById("questionText").innerText = q.question;

  const hintBox = document.getElementById("hintBox");
  hintBox.innerText = "";
  hintBox.classList.remove("hint-box");

  const feedbackBox = document.getElementById("feedback");
  feedbackBox.innerText = "";
  feedbackBox.classList.remove("correct", "incorrect");

  const followUpContainer = document.getElementById("followUpContainer");
  followUpContainer.innerHTML = "";
  followUpContainer.style.display = "none";

  const optionsBox = document.getElementById("optionsBox");
  optionsBox.innerHTML = "";
  q.options.forEach((opt, i) => {
    const label = document.createElement("label");
    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = "option";
    radioInput.value = String.fromCharCode(65 + i);

    radioInput.addEventListener("click", () => handleSubmitAnswer(radioInput.value));

    label.appendChild(radioInput);
    label.append(` ${opt}`);
    optionsBox.appendChild(label);
  });

  const isQuestionAnswered = answeredQuestions.has(index);
  document.getElementById("showHint").disabled = isQuestionAnswered;
  document.getElementById("prevButton").disabled = index === 0;
  // Next button is disabled only if it's the last question AND it's already answered
  document.getElementById("nextButton").disabled = (index === selectedSectionQuestions.length - 1 && isQuestionAnswered);


  if (isQuestionAnswered) {
    document.querySelectorAll("input[name='option']").forEach(radio => {
      if (radio.value === q.userSelectedAnswer) {
        radio.checked = true;
      }
      radio.disabled = true;
    });

    feedbackBox.innerText = q.lastFeedbackText;
    feedbackBox.classList.add(q.wasCorrectLastTime ? "correct" : "incorrect");

    if (q.followUpNeeded) {
        showFollowUp(q, true);
    }
  }
}

function handleSubmitAnswer(selectedValue) {
  // Use selectedSectionQuestions for current question logic
  const q = selectedSectionQuestions[currentQuestionIndex];
  
  if (answeredQuestions.has(currentQuestionIndex)) {
    return;
  }

  q.endTime = new Date();
  const timeSpent = (q.endTime - q.startTime) / 1000;

  const wasCorrect = selectedValue === q.correctAnswer;
  const feedbackBox = document.getElementById("feedback");

  q.userSelectedAnswer = selectedValue;
  q.wasCorrectLastTime = wasCorrect;

  let feedbackText = '';
  if (q.feedback) { // Check for old format (q1-q55)
    feedbackText = usedHint ? (wasCorrect ? q.feedback.correct_hint : q.feedback.incorrect_hint) : (wasCorrect ? q.feedback.correct_no_hint : q.feedback.incorrect_no_hint);
  } else { // Handle new format (q56+) that uses explanationCorrect/IncorrectX
    const selectedOptionKey = selectedValue; // e.g., "A", "B", "C", "D"
    if (wasCorrect) {
      feedbackText = `✅ Correct! ${q.explanationCorrect || ''}`;
    } else {
      // Access specific incorrect explanation based on selected value (e.g., explanationIncorrectA)
      feedbackText = `❌ Incorrect. ${q[`explanationIncorrect${selectedOptionKey}`] || ''}`;
    }
  }

  q.lastFeedbackText = feedbackText;
  answeredQuestions.add(currentQuestionIndex);

  feedbackBox.innerText = q.lastFeedbackText;
  if (wasCorrect) {
    feedbackBox.classList.add("correct");
    feedbackBox.classList.remove("incorrect");
    correctCount++;
    // Check for both old (followUpQuestion) and new (followUpCorrect) follow-up fields
    if (q.followUpQuestion || q.followUpCorrect) {
      q.followUpNeeded = true;
      if (!followUpAnswered.has(q.id)) { // Only show if not answered in this session
        showFollowUp(q);
      }
    }
  } else {
    feedbackBox.classList.add("incorrect");
    feedbackBox.classList.remove("correct");
    incorrectCount++;
  }

  document.querySelectorAll("input[name='option']").forEach(radio => radio.disabled = true);
  document.getElementById("showHint").disabled = true;

  logAnswer(
    q.section,
    currentSessionId,
    `${selectedSectionQuestions.findIndex(q2 => q2.id === q.id) + 1}/${selectedSectionQuestions.length}`, // Use selectedSectionQuestions.length
    usedHint ? "Yes" : "No",
    selectedValue,
    wasCorrect ? "Correct" : "Incorrect",
    timeSpent.toFixed(2),
    q.lastFeedbackText,
    "N/A", // Follow-up answer initially N/A
    "N/A", // Overall score initially N/A
    q.id,
    q.question
  );
}

function markQuestionAsSkipped(index) {
    const q = selectedSectionQuestions[index]; // Use selectedSectionQuestions
    if (!answeredQuestions.has(index)) {
        q.endTime = new Date();
        const timeSpent = (q.endTime - (q.startTime || new Date())) / 1000;

        answeredQuestions.add(index);
        incorrectCount++;
        
        q.userSelectedAnswer = "N/A (Skipped)";
        q.wasCorrectLastTime = false;
        q.lastFeedbackText = "❌ Question skipped.";
        
        logAnswer(
            q.section,
            currentSessionId,
            `${selectedSectionQuestions.findIndex(q2 => q2.id === q.id) + 1}/${selectedSectionQuestions.length}`, // Use selectedSectionQuestions.length
            usedHint ? "Yes" : "No",
            "N/A (Skipped)",
            "Skipped",
            timeSpent.toFixed(2),
            q.lastFeedbackText,
            "N/A",
            "N/A",
            q.id,
            q.question
        );
    }
}

function showFollowUp(q, isRevisit = false) {
  const followUp = document.getElementById("followUpContainer");
  // Dynamically choose the follow-up question text based on which field exists
  const followUpQuestionText = q.followUpCorrect || q.followUpQuestion;
  followUp.innerHTML = `<p>${followUpQuestionText}</p>`;

  // Dynamically choose the follow-up options based on which field exists
  const followUpOptions = q.followUpCorrectOptions || q.followUpOptions;

  followUpOptions.forEach((opt, i) => {
    const label = document.createElement("label");
    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = "followUp";
    radioInput.value = String.fromCharCode(65 + i);

    radioInput.addEventListener("click", () => handleSubmitFollowUp(radioInput.value, q, followUp));

    label.appendChild(radioInput);
    label.append(` ${opt}`);
    followUp.appendChild(label);

    if (isRevisit && q.followUpAnsweredThisTime) {
        if (radioInput.value === q.userSelectedFollowUpAnswer) {
            radioInput.checked = true;
        }
        radioInput.disabled = true;
    }
  });

  followUp.style.display = "block";

  if (isRevisit && q.followUpAnsweredThisTime) {
      const feedbackParagraph = document.createElement("p");
      feedbackParagraph.innerText = q.lastFollowUpFeedbackText;
      feedbackParagraph.classList.add(q.lastFollowUpAnswerWasCorrect ? "correct" : "incorrect");
      followUp.appendChild(feedbackParagraph);
      followUp.querySelectorAll("input[name='followUp']").forEach(radio => radio.disabled = true);
  }
}

function handleSubmitFollowUp(selectedValue, q, followUpContainer) {
    if (q.followUpAnsweredThisTime) {
        return;
    }

    // Dynamically choose the correct follow-up answer field
    const correct = selectedValue === (q.followUpCorrectAnswer || q.followUpAnswer);
    const feedbackText = correct ? "✅ Correct!" : "❌ Incorrect." ;
    const feedbackParagraph = document.createElement("p");
    feedbackParagraph.innerText = feedbackText;
    feedbackParagraph.classList.add(correct ? "correct" : "incorrect");
    followUpContainer.appendChild(feedbackParagraph);

    followUpAnswered.add(q.id); // Mark follow-up for this question ID as answered

    q.followUpAnsweredThisTime = true;
    q.lastFollowUpFeedbackText = feedbackText;
    q.lastFollowUpAnswerWasCorrect = correct;
    q.userSelectedFollowUpAnswer = selectedValue;

    followUpContainer.querySelectorAll("input[name='followUp']").forEach(radio => radio.disabled = true);

    logAnswer(
        q.section,
        currentSessionId,
        `${selectedSectionQuestions.findIndex(q2 => q2.id === q.id) + 1}/${selectedSectionQuestions.length}(Follow-up)`, // Use selectedSectionQuestions.length
        "N/A", // Hint status for main question, N/A for follow-up log
        selectedValue, // Answer given for follow-up
        correct ? "Correct" : "Incorrect", // Correct status for follow-up
        "N/A", // Time spent for follow-up
        feedbackText, // Feedback for follow-up
        selectedValue, // This will be the followupAnswer column in your sheet
        "N/A", // Overall score is for final log
        `${q.id}_followup`, // Unique ID for follow-up log
        q.followUpCorrect || q.followUpQuestion // Follow-up question text
    );
}

function logAnswer(
    section,
    sessionId,
    questionNumberDisplay,
    usedHintStatus,
    answerGiven,
    correctStatus,
    timeSpent,
    feedbackText,
    followupAnswerValue, // This parameter will receive the actual follow-up answer when logging main question, and its own selectedValue for follow-up log
    overallScore, // This parameter is relevant for final log only
    questionIdInternal,
    questionTextContent
) {
  const payload = {
    action: "logQuestion",
    email: userEmail,
    sessionId: sessionId,
    section: section, // Added section to payload
    questionNumberDisplay: questionNumberDisplay,
    questionId: questionIdInternal,
    questionText: questionTextContent,
    usedHint: usedHintStatus,
    answerGiven: answerGiven,
    correct: correctStatus,
    timeSpent: timeSpent,
    feedbackShown: feedbackText,
    followupAnswer: followupAnswerValue,
    overallScore: overallScore, // Will be "N/A" for question logs, actual score for final log
    timestamp: new Date().toISOString()
  };

  fetch(googleAppsScriptURL, {
    redirect: "follow",
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "text/plain;charset=utf-8" }
  })
  .then(response => response.json())
  .then(data => {
      if (data.status === "success") {
          console.log("Log successful:", data.message);
      } else {
          console.error("Log failed:", data.message);
      }
  })
  .catch(err => console.error("Log failed (network error or script issue):", err));
}

function logFinalScore(finalCorrectCount, finalIncorrectCount, totalQuestions, percentage) {
    const payload = {
        action: "logFinalScore",
        email: userEmail,
        sessionId: currentSessionId,
        totalQuestions: totalQuestions,
        correctCount: finalCorrectCount,
        incorrectCount: finalIncorrectCount,
        percentageScore: percentage,
        section: selectedSectionQuestions.length > 0 ? selectedSectionQuestions[0].section : "", // Add this
        timestamp: new Date().toISOString()
    };

    fetch(googleAppsScriptURL, {
        redirect: "follow",
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "text/plain;charset=utf-8" }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            console.log("Final score logged successfully:", data.message);
        } else {
            console.error("Final score log failed:", data.message);
        }
    })
    .catch(err => console.error("Final score log failed (network error or script issue):", err));
}

function showScore() {
  document.getElementById("questionScreen").style.display = "none";
  const scoreScreen = document.getElementById("scoreScreen");
  const finalScore = document.getElementById("finalScore");
  
  const totalQuestions = selectedSectionQuestions.length; // Use selectedSectionQuestions.length for score
  const percentage = totalQuestions > 0 ? ((correctCount / totalQuestions) * 100).toFixed(2) : 0;

  finalScore.innerHTML = `
    <h2>Quiz Completed!</h2>
    <p>Correct Answers: ${correctCount}</p>
    <p>Incorrect Answers: ${incorrectCount}</p>
    <p>Score: ${percentage}%</p>
    <button id="restartQuizButton">Take Another Quiz</button>
  `;
  scoreScreen.style.display = "block";


  logFinalScore(correctCount, incorrectCount, totalQuestions, percentage);

  document.getElementById("restartQuizButton").addEventListener("click", () => {
    currentQuestionIndex = 0;
    answeredQuestions.clear();
    correctCount = 0;
    incorrectCount = 0;
    usedHint = false;
    followUpAnswered.clear();
    selectedSectionQuestions = []; // Clear questions for previous section
    currentSessionId = "";

    document.getElementById("scoreScreen").style.display = "none";
    document.getElementById("emailInput").value = "";
    document.getElementById("emailScreen").style.display = "none";
    document.getElementById("home").style.display = "block";
    showSectionList();
  });
}
