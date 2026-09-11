

Representing Qubit States
You now know something about bits, and about how our familiar digital computers work. All the complex variables, objects and data structures used in modern software are basically all just big piles of bits. Those of us who work on quantum computing call these classical variables. The computers that use them, like the one you are using to read this article, we call classical computers.

In quantum computers, our basic variable is the qubit: a quantum variant of the bit. These have exactly the same restrictions as normal bits do: they can store only a single binary piece of information, and can only ever give us an output of 0 or 1. However, they can also be manipulated in ways that can only be described by quantum mechanics. This gives us new gates to play with, allowing us to find new ways to design algorithms.

To fully understand these new gates, we first need to understand how to write down qubit states. For this we will use the mathematics of vectors, matrices, and complex numbers. Though we will introduce these concepts as we go, it would be best if you are comfortable with them already. If you need a more in-depth explanation or a refresher, you can find the guide here.

Contents
Classical vs Quantum Bits
1.1 Statevectors
1.2 Qubit Notation
1.3 Exploring Qubits with Qiskit
The Rules of Measurement
2.1 A Very Important Rule
2.2 The Implications of this Rule
The Bloch Sphere
3.1 Describing the Restricted Qubit State
3.2 Visually Representing a Qubit State
1. Classical vs Quantum Bits
1.1 Statevectors
In quantum physics we use statevectors to describe the state of our system. Say we wanted to describe the position of a car along a track, this is a classical system so we could use a number 
:

tracking a car with scalars


Alternatively, we could instead use a collection of numbers in a vector called a statevector. Each element in the statevector contains the probability of finding the car in a certain place:

tracking a car with vectors

 
  
 

This isn’t limited to position, we could also keep a statevector of all the possible speeds the car could have, and all the possible colours the car could be. With classical systems (like the car example above), this is a silly thing to do as it requires keeping huge vectors when we only really need one number. But as we will see in this chapter, statevectors happen to be a very good way of keeping track of quantum systems, including quantum computers.

1.2 Qubit Notation
Classical bits always have a completely well-defined state: they are either 0 or 1 at every point during a computation. There is no more detail we can add to the state of a bit than this. So to write down the state of a of classical bit (c), we can just use these two binary values. For example:

c = 0
This restriction is lifted for quantum bits. Whether we get a 0 or a 1 from a qubit only needs to be well-defined when a measurement is made to extract an output. At that point, it must commit to one of these two options. At all other times, its state will be something more complex than can be captured by a simple binary value.

To see how to describe these, we can first focus on the two simplest cases. As we saw in the last section, it is possible to prepare a qubit in a state for which it definitely gives the outcome 0 when measured.

We need a name for this state. Let's be unimaginative and call it 
 . Similarly, there exists a qubit state that is certain to output a 1. We'll call this 
. These two states are completely mutually exclusive. Either the qubit definitely outputs a 0, or it definitely outputs a 1. There is no overlap. One way to represent this with mathematics is to use two orthogonal vectors.

  
 

This is a lot of notation to take in all at once. First, let's unpack the weird 
 and 
. Their job is essentially just to remind us that we are talking about the vectors that represent qubit states labelled 
 and 
. This helps us distinguish them from things like the bit values 0 and 1 or the numbers 0 and 1. It is part of the bra-ket notation, introduced by Dirac.

If you are not familiar with vectors, you can essentially just think of them as lists of numbers which we manipulate using certain rules. If you are familiar with vectors from your high school physics classes, you'll know that these rules make vectors well-suited for describing quantities with a magnitude and a direction. For example, the velocity of an object is described perfectly with a vector. However, the way we use vectors for quantum states is slightly different to this, so don't hold on too hard to your previous intuition. It's time to do something new!

With vectors we can describe more complex states than just 
 and 
. For example, consider the vector

 
 
 

To understand what this state means, we'll need to use the mathematical rules for manipulating vectors. Specifically, we'll need to understand how to add vectors together and how to multiply them by scalars.


Reminder: Matrix Addition and Multiplication by Scalars (Click here to expand)
To add two vectors, we add their elements together:
 
 
 

And to multiply a vector by a scalar, we multiply each element by the scalar:
 

These two rules are used to rewrite the vector 
 (as shown above):
 
 
 
 
 
 
 
  
 
 
 
 
 
 


Reminder: Orthonormal Bases (Click here to expand)
It was stated before that the two vectors 
 and 
 are orthonormal, this means they are both orthogonal and normalised. Orthogonal means the vectors are at right angles:



And normalised means their magnitudes (length of the arrow) is equal to 1. The two vectors 
 and 
 are linearly independent, which means we cannot describe 
 in terms of 
, and vice versa. However, using both the vectors 
 and 
, and our rules of addition and multiplication by scalars, we can describe all possible vectors in 2D space:



Because the vectors 
 and 
 are linearly independent, and can be used to describe any vector in 2D space using vector addition and scalar multiplication, we say the vectors 
 and 
 form a basis. In this case, since they are both orthogonal and normalised, we call it an orthonormal basis.

Since the states 
 and 
 form an orthonormal basis, we can represent any 2D vector with a combination of these two states. This allows us to write the state of our qubit in the alternative form:

 
 

This vector, 
 is called the qubit's statevector, it tells us everything we could possibly know about this qubit. For now, we are only able to draw a few simple conclusions about this particular example of a statevector: it is not entirely 
 and not entirely 
. Instead, it is described by a linear combination of the two. In quantum mechanics, we typically describe linear combinations such as this using the word 'superposition'.

Though our example state 
 can be expressed as a superposition of 
 and 
, it is no less a definite and well-defined qubit state than they are. To see this, we can begin to explore how a qubit can be manipulated.

1.3 Exploring Qubits with Qiskit
First, we need to import all the tools we will need:

from qiskit import QuantumCircuit, assemble, Aer
from qiskit.visualization import plot_histogram, plot_bloch_vector
from math import sqrt, pi
from qiskit_aer import Aer
In Qiskit, we use the QuantumCircuit object to store our circuits, this is essentially a list of the quantum operations on our circuit and the qubits they are applied to.

qc = QuantumCircuit(1) # Create a quantum circuit with one qubit
In our quantum circuits, our qubits always start out in the state 
. We can use the initialize() method to transform this into any state. We give initialize() the vector we want in the form of a list, and tell it which qubit(s) we want to initialize in this state:

qc = QuantumCircuit(1)  # Create a quantum circuit with one qubit
initial_state = [0,1]   # Define initial_state as |1>
qc.initialize(initial_state, 0) # Apply initialisation operation to the 0th qubit
qc.draw()  # Let's view our circuit
b'\n\n
We can then use one of Qiskit’s simulators to view the resulting state of our qubit.

sim = Aer.get_backend('aer_simulator')  # Tell Qiskit how to simulate our circuit
To get the results from our circuit, we use run to execute our circuit, giving the circuit and the backend as arguments. We then use .result() to get the result of this:

qc = QuantumCircuit(1)  # Create a quantum circuit with one qubit
initial_state = [0,1]   # Define initial_state as |1>
qc.initialize(initial_state, 0) # Apply initialisation operation to the 0th qubit
qc.save_statevector()   # Tell simulator to save statevector
qobj = assemble(qc)     # Create a Qobj from the circuit for the simulator to run
result = sim.run(qobj).result() # Do the simulation and return the result
from result, we can then get the final statevector using .get_statevector():

out_state = result.get_statevector()
print(out_state) # Display the output state vector
Statevector([0.+0.j, 1.+0.j],
            dims=(2,))
Note: Python uses j to represent 
 in complex numbers. We see a vector with two complex elements: 0.+0.j = 0, and 1.+0.j = 1.

Let’s now measure our qubit as we would in a real quantum computer and see the result:

qc.measure_all()
qc.draw()
b'\n\n
This time, instead of the statevector we will get the counts for the 0 and 1 results using .get_counts():

qobj = assemble(qc)
result = sim.run(qobj).result()
counts = result.get_counts()
plot_histogram(counts)
b'\n\n
We can see that we (unsurprisingly) have a 100% chance of measuring 
. This time, let’s instead put our qubit into a superposition and see what happens. We will use the state 
 from earlier in this section:

 
 

We need to add these amplitudes to a python list. To add a complex amplitude, Python uses j for the imaginary unit (we normally call it "
" mathematically):

initial_state = [1/sqrt(2), 1j/sqrt(2)]  # Define state |q_0>
And we then repeat the steps for initialising the qubit as before:

qc = QuantumCircuit(1) # Must redefine qc
qc.initialize(initial_state, 0) # Initialize the 0th qubit in the state `initial_state`
qc.save_statevector() # Save statevector
qobj = assemble(qc)
state = sim.run(qobj).result().get_statevector() # Execute the circuit
print(state)           # Print the result
Statevector([0.70710678+0.j        , 0.        +0.70710678j],
            dims=(2,))
qobj = assemble(qc)
results = sim.run(qobj).result().get_counts()
plot_histogram(results)
b'\n\n
We can see we have equal probability of measuring either 
 or 
. To explain this, we need to talk about measurement.

2. The Rules of Measurement
2.1 A Very Important Rule
There is a simple rule for measurement. To find the probability of measuring a state 
 in the state 
 we do:


The symbols 
 and 
 tell us 
 is a row vector and the symbols 
 and 
 tell us 
 is a column vector. In quantum mechanics we call the column vectors kets and the row vectors bras. Together they make up bra-ket notation. Any ket 
 has a corresponding bra 
, and we convert between them using the conjugate transpose.

Reminder: Conjugate Transpose (Click here to expand)
Conversion between bra-ket takes places using the conjugate transpose method. We know a ket (column vector) is represented as follows:
 

In conjugate transpose method, the matrix is transposed and the elements are complex conjugated (represented by the "
" operation) where complex conjugate ("
") of a complex number is a number with an equal real part and an imaginary part equal in magnitude but opposite in sign. This gives the coressponding bra (row vector) as follows:
 

Reminder: The Inner Product (Click here to expand)
There are different ways to multiply vectors, here we use the inner product. The inner product is a generalisation of the dot product which you may already be familiar with. In this guide, we use the inner product between a bra (row vector) and a ket (column vector), and it follows this rule:

    
 
 

We can see that the inner product of two vectors always gives us a scalar. A useful thing to remember is that the inner product of two orthogonal vectors is 0, for example if we have the orthogonal vectors 
 and 
:
  
 

Additionally, remember that the vectors 
 and 
 are also normalised (magnitudes are equal to 1):

  
 
  
 
 

In the equation above, 
 can be any qubit state. To find the probability of measuring 
, we take the inner product of 
 and the state we are measuring (in this case 
), then square the magnitude. This may seem a little convoluted, but it will soon become second nature.

If we look at the state 
 from before, we can see the probability of measuring 
 is indeed 
:

 
 
 
 
 
 
 
 
 

You should verify the probability of measuring 
 as an exercise.

This rule governs how we get information out of quantum states. It is therefore very important for everything we do in quantum computation. It also immediately implies several important facts.

2.2 The Implications of this Rule
#1 Normalisation
The rule shows us that amplitudes are related to probabilities. If we want the probabilities to add up to 1 (which they should!), we need to ensure that the statevector is properly normalized. Specifically, we need the magnitude of the state vector to be 1.


Thus if:


Then:


This explains the factors of 
 you have seen throughout this chapter. In fact, if we try to give initialize() a vector that isn’t normalised, it will give us an error:

vector = [1,1]
qc.initialize(vector, 0)
---------------------------------------------------------------------------
QiskitError                               Traceback (most recent call last)
Input In [12], in <cell line: 2>()
      1 vector = [1,1]
----> 2 qc.initialize(vector, 0)

File /usr/local/lib/python3.8/site-packages/qiskit/extensions/quantum_initializer/initializer.py:191, in initialize(self, params, qubits)
    188     qubits = [qubits]
    189 num_qubits = len(qubits) if isinstance(params, int) else None
--> 191 return self.append(Initialize(params, num_qubits), qubits)

File /usr/local/lib/python3.8/site-packages/qiskit/extensions/quantum_initializer/initializer.py:57, in Initialize.__init__(self, params, num_qubits)
     36 def __init__(self, params, num_qubits=None):
     37     r"""Create new initialize composite.
     38 
     39     Args:
   (...)
     55             and the remaining 3 qubits to be initialized to :math:`|0\rangle`.
     56     """
---> 57     self._stateprep = StatePreparation(params, num_qubits)
     59     super().__init__("initialize", self._stateprep.num_qubits, 0, self._stateprep.params)

File /usr/local/lib/python3.8/site-packages/qiskit/circuit/library/data_preparation/state_preparation.py:99, in StatePreparation.__init__(self, params, num_qubits, inverse, label)
     96 self._from_label = isinstance(params, str)
     97 self._from_int = isinstance(params, int)
---> 99 num_qubits = self._get_num_qubits(num_qubits, params)
    101 params = [params] if isinstance(params, int) else params
    103 super().__init__(self._name, num_qubits, params, label=self._label)

File /usr/local/lib/python3.8/site-packages/qiskit/circuit/library/data_preparation/state_preparation.py:202, in StatePreparation._get_num_qubits(self, num_qubits, params)
    200     # Check if probabilities (amplitudes squared) sum to 1
    201     if not math.isclose(sum(np.absolute(params) ** 2), 1.0, abs_tol=_EPS):
--> 202         raise QiskitError("Sum of amplitudes-squared does not equal one.")
    204     num_qubits = int(num_qubits)
    205 return num_qubits

QiskitError: 'Sum of amplitudes-squared does not equal one.'
Quick Exercise
Create a state vector that will give a 
 probability of measuring 
.
Create a different state vector that will give the same measurement probabilities.
Verify that the probability of measuring 
 for these two states is 
.
You can check your answer in the widget below (accepts answers ±1% accuracy, you can use numpy terms such as 'pi' and 'sqrt()' in the vector):

# Run the code in this cell to interact with the widget
from qiskit_textbook.widgets import state_vector_exercise
state_vector_exercise(target=1/3)
VBox(children=(Label(value='State Vector:'), HBox(children=(Text(value='[1, 0]', placeholder='Type something')…
HTML(value='<pre></pre>')
#2 Alternative measurement
The measurement rule gives us the probability 
 that a state 
 is measured as 
. Nowhere does it tell us that 
 can only be either 
 or 
.

The measurements we have considered so far are in fact only one of an infinite number of possible ways to measure a qubit. For any orthogonal pair of states, we can define a measurement that would cause a qubit to choose between the two.

This possibility will be explored more in the next section. For now, just bear in mind that 
 is not limited to being simply 
 or 
.

#3 Global Phase
We know that measuring the state 
 will give us the output 1 with certainty. But we are also able to write down states such as

 

To see how this behaves, we apply the measurement rule.


Here we find that the factor of 
 disappears once we take the magnitude of the complex number. This effect is completely independent of the measured state 
. It does not matter what measurement we are considering, the probabilities for the state 
 are identical to those for 
. Since measurements are the only way we can extract any information from a qubit, this implies that these two states are equivalent in all ways that are physically relevant.

More generally, we refer to any overall factor 
 on a state for which 
 as a 'global phase'. States that differ only by a global phase are physically indistinguishable.


Note that this is distinct from the phase difference between terms in a superposition, which is known as the 'relative phase'. This becomes relevant once we consider different types of measurement and multiple qubits.

#4 The Observer Effect
We know that the amplitudes contain information about the probability of us finding the qubit in a specific state, but once we have measured the qubit, we know with certainty what the state of the qubit is. For example, if we measure a qubit in the state:


And find it in the state 
, if we measure again, there is a 100% chance of finding the qubit in the state 
. This means the act of measuring changes the state of our qubits.

 
 
 

We sometimes refer to this as collapsing the state of the qubit. It is a potent effect, and so one that must be used wisely. For example, were we to constantly measure each of our qubits to keep track of their value at each point in a computation, they would always simply be in a well-defined state of either 
 or 
. As such, they would be no different from classical bits and our computation could be easily replaced by a classical computation. To achieve truly quantum computation we must allow the qubits to explore more complex states. Measurements are therefore only used when we need to extract an output. This means that we often place all the measurements at the end of our quantum circuit.

We can demonstrate this using Qiskit’s statevector simulator. Let's initialize a qubit in superposition:

qc = QuantumCircuit(1) # We are redefining qc
initial_state = [0.+1.j/sqrt(2),1/sqrt(2)+0.j]
qc.initialize(initial_state, 0)
qc.draw()
b'\n\n
This should initialize our qubit in the state:

 
 

We can verify this using the simulator:

qc.save_statevector()
result = sim.run(assemble(qc)).result()
state = result.get_statevector()
print("Qubit State = " + str(state))
Qubit State = Statevector([0.        +0.70710678j, 0.70710678+0.j        ],
            dims=(2,))
We can see here the qubit is initialized in the state [0.+0.70710678j 0.70710678+0.j], which is the state we expected.

Let’s now create a circuit where we measure this qubit:

qc = QuantumCircuit(1) # We are redefining qc
initial_state = [0.+1.j/sqrt(2),1/sqrt(2)+0.j]
qc.initialize(initial_state, 0)
qc.measure_all()
qc.save_statevector()
qc.draw()
b'\n\n
When we simulate this entire circuit, we can see that one of the amplitudes is always 0:

qobj = assemble(qc)
state = sim.run(qobj).result().get_statevector()
print("State of Measured Qubit = " + str(state))
State of Measured Qubit = Statevector([0.+1.j, 0.+0.j],
            dims=(2,))
You can re-run this cell a few times to reinitialize the qubit and measure it again. You will notice that either outcome is equally probable, but that the state of the qubit is never a superposition of 
 and 
. Somewhat interestingly, the global phase on the state 
 survives, but since this is global phase, we can never measure it on a real quantum computer.

A Note about Quantum Simulators
We can see that writing down a qubit’s state requires keeping track of two complex numbers, but when using a real quantum computer we will only ever receive a yes-or-no (0 or 1) answer for each qubit. The output of a 10-qubit quantum computer will look like this:

0110111110

Just 10 bits, no superposition or complex amplitudes. When using a real quantum computer, we cannot see the states of our qubits mid-computation, as this would destroy them! This behaviour is not ideal for learning, so Qiskit provides different quantum simulators: By default, the aer_simulator mimics the execution of a real quantum computer, but will also allow you to peek at quantum states before measurement if we include certain instructions in our circuit. For example, here we have included the instruction .save_statevector(), which means we can use .get_statevector() on the result of the simulation.

3. The Bloch Sphere
3.1 Describing the Restricted Qubit State
We saw earlier in this chapter that the general state of a qubit (
) is:



(The second line tells us 
 and 
 are complex numbers). The first two implications in section 2 tell us that we cannot differentiate between some of these states. This means we can be more specific in our description of the qubit.

Firstly, since we cannot measure global phase, we can only measure the difference in phase between the states 
 and 
. Instead of having 
 and 
 be complex, we can confine them to the real numbers and add a term to tell us the relative phase between them:



Finally, since the qubit state must be normalised, i.e.


we can use the trigonometric identity:


to describe the real 
 and 
 in terms of one variable, 
:

 
 

From this we can describe the state of any qubit using the two variables 
 and 
:

 
 


3.2 Visually Representing a Qubit State
We want to plot our general qubit state:

 
 

If we interpret 
 and 
 as spherical co-ordinates (
, since the magnitude of the qubit state is 
), we can plot any single qubit state on the surface of a sphere, known as the Bloch sphere.

Below we have plotted a qubit in the state 
. In this case, 
 and 
.

Qiskit has a function to plot a Bloch sphere, plot_bloch_vector(). This function accepts cartesian coordinates by default, but can also accept spherical coordinates by passing the argument coord_type='spherical'.

You can also try this interactive Bloch sphere demo.

from qiskit.visualization import plot_bloch_vector
coords = [1,pi/2,0]  # [Radius, Theta, Phi]
plot_bloch_vector(coords, coord_type='spherical')
b'\n\n
Warning!
When first learning about qubit states, it's easy to confuse the qubits statevector with its Bloch vector. Remember the statevector is the vector discussed in 1.1, that holds the amplitudes for the two states our qubit can be in. The Bloch vector is a visualisation tool that maps the 2D, complex statevector onto real, 3D space.

Quick Exercise
Use plot_bloch_vector() to plot a qubit in the states:

 
 
 
 
import qiskit.tools.jupyter
%qiskit_version_table
Version Information
Qiskit Software	Version
qiskit-terra	0.22.0
qiskit-aer	0.11.0
qiskit-ibmq-provider	0.19.2
qiskit	0.39.0
qiskit-nature	0.4.1
qiskit-finance	0.3.2
qiskit-optimization	0.4.0
qiskit-machine-learning	0.4.0
System information
Python version	3.8.13
Python compiler	Clang 13.1.6 (clang-1316.0.21.2.5)
Python build	default, Aug 29 2022 05:17:23
OS	Darwin
CPUs	8
Memory (Gb)	32.0
Mon Nov 28 09:32:47 2022 GMT