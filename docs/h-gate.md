
Single Qubit Gates
In the previous section we looked at all the possible states a qubit could be in. We saw that qubits could be represented by 2D vectors, and that their states are limited to the form:

 
 

Where 
 and 
 are real numbers. In this section we will cover gates, the operations that change a qubit between these states. Due to the number of gates and the similarities between them, this chapter is at risk of becoming a list. To counter this, we have included a few digressions to introduce important ideas at appropriate places throughout the chapter.

Contents
The Pauli Gates
1.1 The X-Gate
1.2 The Y & Z-Gates
Digression: The X, Y & Z-Bases
The Hadamard Gate
Digression: Measuring in Different Bases
The P-gate
The I, S and T-gates
6.1 The I-Gate
6.2 The S-Gate
6.3 The T-Gate
The General U-gate
In The Atoms of Computation we came across some gates and used them to perform a classical computation. An important feature of quantum circuits is that, between initialising the qubits and measuring them, the operations (gates) are always reversible! These reversible gates can be represented as matrices, and as rotations around the Bloch sphere.

from qiskit import QuantumCircuit, assemble, Aer
from math import pi, sqrt
from qiskit.visualization import plot_bloch_multivector, plot_histogram
sim = Aer.get_backend('aer_simulator')
1. The Pauli Gates
You should be familiar with the Pauli matrices from the linear algebra section. If any of the maths here is new to you, you should use the linear algebra section to bring yourself up to speed. We will see here that the Pauli matrices can represent some very commonly used quantum gates.

1.1 The X-Gate
The X-gate is represented by the Pauli-X matrix:

 

To see the effect a gate has on a qubit, we simply multiply the qubit’s statevector by the gate. We can see that the X-gate switches the amplitudes of the states 
 and 
:

  
  
 

Reminder: Multiplying Vectors by Matrices (Click here to expand)
Matrix multiplication is a generalisation of the inner product we saw in the last chapter. In the specific case of multiplying a vector by a matrix (as seen above), we always get a vector back:
  
  
 
In quantum computing, we can write our matrices in terms of basis vectors:
This can sometimes be clearer than using a box matrix as we can see what different multiplications will result in:
 
In fact, when we see a ket and a bra multiplied like this:
this is called the outer product, which follows the rule:
 
where 
 denotes the complex conjugation. We can see this does indeed result in the X-matrix as seen above:
  
  
 

In Qiskit, we can create a short circuit to verify this:

# Let's do an X-gate on a |0> qubit
qc = QuantumCircuit(1)
qc.x(0)
qc.draw()

Let's see the result of the above circuit. Note: Here we use plot_bloch_multivector() which takes a qubit's statevector instead of the Bloch vector.

# Let's see the result
qc.save_statevector()
qobj = assemble(qc)
state = sim.run(qobj).result().get_statevector()
plot_bloch_multivector(state)

We can indeed see the state of the qubit is 
 as expected. We can think of this as a rotation by 
 radians around the x-axis of the Bloch sphere. The X-gate is also often called a NOT-gate, referring to its classical analogue.

1.2 The Y & Z-gates
Similarly to the X-gate, the Y & Z Pauli matrices also act as the Y & Z-gates in our quantum circuits:

  
 


And, unsurprisingly, they also respectively perform rotations by 
 around the y and z-axis of the Bloch sphere.

Below is a widget that displays a qubit’s state on the Bloch sphere, pressing one of the buttons will perform the gate on the qubit:

# Run the code in this cell to see the widget
from qiskit_textbook.widgets import gate_demo
gate_demo(gates='pauli')
HBox(children=(Button(description='X', layout=Layout(height='3em', width='3em'), style=ButtonStyle()), Button(…
Image(value=b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x01 \x00\x00\x01 \x08\x06\x00\x00\x00\x14\x83\xae\x8…
In Qiskit, we can apply the Y and Z-gates to our circuit using:

qc.y(0) # Do Y-gate on qubit 0
qc.z(0) # Do Z-gate on qubit 0
qc.draw()

2. Digression: The X, Y & Z-Bases
Reminder: Eigenvectors of Matrices (Click here to expand) We have seen that multiplying a vector by a matrix results in a vector:
 
If we chose the right vectors and matrices, we can find a case in which this matrix multiplication is the same as doing a multiplication by a scalar:
(Above, 
 is a matrix, and 
 is a scalar). For a matrix 
, any vector that has this property is called an eigenvector of 
. For example, the eigenvectors of the Z-matrix are the states 
 and 
:

 
Since we use vectors to describe the state of our qubits, we often call these vectors eigenstates in this context. Eigenvectors are very important in quantum computing, and it is important you have a solid grasp of them.

You may also notice that the Z-gate appears to have no effect on our qubit when it is in either of these two states. This is because the states 
 and 
 are the two eigenstates of the Z-gate. In fact, the computational basis (the basis formed by the states 
 and 
) is often called the Z-basis. This is not the only basis we can use, a popular basis is the X-basis, formed by the eigenstates of the X-gate. We call these two vectors 
 and 
:

 
 
 

 
 
 

Another less commonly used basis is that formed by the eigenstates of the Y-gate. These are called:


We leave it as an exercise to calculate these. There are in fact an infinite number of bases; to form one, we simply need two orthogonal vectors. The eigenvectors of both Hermitian and unitary matrices form a basis for the vector space. Due to this property, we can be sure that the eigenstates of the X-gate and the Y-gate indeed form a basis for 1-qubit states (read more about this in the linear algebra page in the appendix)

Quick Exercises
Verify that 
 and 
 are in fact eigenstates of the X-gate.
What eigenvalues do they have?
Find the eigenstates of the Y-gate, and their co-ordinates on the Bloch sphere.
Using only the Pauli-gates it is impossible to move our initialized qubit to any state other than 
 or 
, i.e. we cannot achieve superposition. This means we can see no behaviour different to that of a classical bit. To create more interesting states we will need more gates!

3. The Hadamard Gate
The Hadamard gate (H-gate) is a fundamental quantum gate. It allows us to move away from the poles of the Bloch sphere and create a superposition of 
 and 
. It has the matrix:

 
 

We can see that this performs the transformations below:



This can be thought of as a rotation around the Bloch vector [1,0,1] (the line between the x & z-axis), or as transforming the state of the qubit between the X and Z bases.

You can play around with these gates using the widget below:

# Run the code in this cell to see the widget
from qiskit_textbook.widgets import gate_demo
gate_demo(gates='pauli+h')
HBox(children=(Button(description='X', layout=Layout(height='3em', width='3em'), style=ButtonStyle()), Button(…
Image(value=b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x01 \x00\x00\x01 \x08\x06\x00\x00\x00\x14\x83\xae\x8…
Quick Exercise
Write the H-gate as the outer products of vectors 
, 
, 
 and 
.
Show that applying the sequence of gates: HZH, to any qubit state is equivalent to applying an X-gate.
Find a combination of X, Z and H-gates that is equivalent to a Y-gate (ignoring global phase).
4. Digression: Measuring in Different Bases
We have seen that the Z-basis is not intrinsically special, and that there are infinitely many other bases. Similarly with measurement, we don’t always have to measure in the computational basis (the Z-basis), we can measure our qubits in any basis.

As an example, let’s try measuring in the X-basis. We can calculate the probability of measuring either 
 or 
:


And after measurement, the superposition is destroyed. Since Qiskit only allows measuring in the Z-basis, we must create our own using Hadamard gates:

# Create the X-measurement function:
def x_measurement(qc, qubit, cbit):
    """Measure 'qubit' in the X-basis, and store the result in 'cbit'"""
    qc.h(qubit)
    qc.measure(qubit, cbit)
    return qc

initial_state = [1/sqrt(2), -1/sqrt(2)]
# Initialize our qubit and measure it
qc = QuantumCircuit(1,1)
qc.initialize(initial_state, 0)
x_measurement(qc, 0, 0)  # measure qubit 0 to classical bit 0
qc.draw()

In the quick exercises above, we saw you could create an X-gate by sandwiching our Z-gate between two H-gates:


Starting in the Z-basis, the H-gate switches our qubit to the X-basis, the Z-gate performs a NOT in the X-basis, and the final H-gate returns our qubit to the Z-basis. We can verify this always behaves like an X-gate by multiplying the matrices:

 
  
 
 
  
 

Following the same logic, we have created an X-measurement by transforming from the X-basis to the Z-basis before our measurement. Since the process of measuring can have different effects depending on the system (e.g. some systems always return the qubit to 
 after measurement, whereas others may leave it as the measured state), the state of the qubit post-measurement is undefined and we must reset it if we want to use it again.

There is another way to see why the Hadamard gate indeed takes us from the Z-basis to the X-basis. Suppose the qubit we want to measure in the X-basis is in the (normalized) state 
. To measure it in X-basis, we first express the state as a linear combination of 
 and 
. Using the relations 
 
 and 
 
, the state becomes 
 
 
. Observe that the probability amplitudes in X-basis can be obtained by applying a Hadamard matrix on the state vector expressed in Z-basis.

Let’s now see the results:

qobj = assemble(qc)  # Assemble circuit into a Qobj that can be run
counts = sim.run(qobj).result().get_counts()  # Do the simulation, returning the state vector
plot_histogram(counts)  # Display the output on measurement of state vector

We initialized our qubit in the state 
, but we can see that, after the measurement, we have collapsed our qubit to the state 
. If you run the cell again, you will see the same result, since along the X-basis, the state 
 is a basis state and measuring it along X will always yield the same result.

Quick Exercises
If we initialize our qubit in the state 
, what is the probability of measuring it in state 
?
Use Qiskit to display the probability of measuring a 
 qubit in the states 
 and 
 (Hint: you might want to use .get_counts() and plot_histogram()).
Try to create a function that measures in the Y-basis.
Measuring in different bases allows us to see Heisenberg’s famous uncertainty principle in action. Having certainty of measuring a state in the Z-basis removes all certainty of measuring a specific state in the X-basis, and vice versa. A common misconception is that the uncertainty is due to the limits in our equipment, but here we can see the uncertainty is actually part of the nature of the qubit.

For example, if we put our qubit in the state 
, our measurement in the Z-basis is certain to be 
, but our measurement in the X-basis is completely random! Similarly, if we put our qubit in the state 
, our measurement in the X-basis is certain to be 
, but now any measurement in the Z-basis will be completely random.

More generally: Whatever state our quantum system is in, there is always a measurement that has a deterministic outcome.

The introduction of the H-gate has allowed us to explore some interesting phenomena, but we are still very limited in our quantum operations. Let us now introduce a new type of gate:

5. The P-gate
The P-gate (phase gate) is parametrised, that is, it needs a number (
) to tell it exactly what to do. The P-gate performs a rotation of 
 around the Z-axis direction. It has the matrix form:

 

Where 
 is a real number.

You can use the widget below to play around with the P-gate, specify 
 using the slider:

# Run the code in this cell to see the widget
from qiskit_textbook.widgets import gate_demo
gate_demo(gates='pauli+h+p')
VBox(children=(HBox(children=(Button(description='X', layout=Layout(height='3em', width='3em'), style=ButtonSt…
Image(value=b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x01 \x00\x00\x01 \x08\x06\x00\x00\x00\x14\x83\xae\x8…
In Qiskit, we specify a P-gate using p(phi, qubit):

qc = QuantumCircuit(1)
qc.p(pi/4, 0)
qc.draw()

You may notice that the Z-gate is a special case of the P-gate, with 
. In fact there are three more commonly referenced gates we will mention in this chapter, all of which are special cases of the P-gate:

6. The I, S and T-gates
6.1 The I-gate
First comes the I-gate (aka ‘Id-gate’ or ‘Identity gate’). This is simply a gate that does nothing. Its matrix is the identity matrix:

 

Applying the identity gate anywhere in your circuit should have no effect on the qubit state, so it’s interesting this is even considered a gate. There are two main reasons behind this, one is that it is often used in calculations, for example: proving the X-gate is its own inverse:


The second, is that it is often useful when considering real hardware to specify a ‘do-nothing’ or ‘none’ operation.

Quick Exercise
What are the eigenstates of the I-gate?
6.2 The S-gates
The next gate to mention is the S-gate (sometimes known as the 
-gate), this is a P-gate with 
. It does a quarter-turn around the Bloch sphere. It is important to note that unlike every gate introduced in this chapter so far, the S-gate is not its own inverse! As a result, you will often see the S†-gate, (also “S-dagger”, “Sdg” or 
-gate). The S†-gate is clearly an P-gate with 
:

 
 
 
 

The name "
-gate" is due to the fact that two successively applied S-gates has the same effect as one Z-gate:


This notation is common throughout quantum computing.

To add an S-gate in Qiskit:

qc = QuantumCircuit(1)
qc.s(0)   # Apply S-gate to qubit 0
qc.sdg(0) # Apply Sdg-gate to qubit 0
qc.draw()

6.3 The T-gate
The T-gate is a very commonly used gate, it is a P-gate with 
:

 
 
 
 

As with the S-gate, the T-gate is sometimes also known as the 
-gate.

In Qiskit:

qc = QuantumCircuit(1)
qc.t(0)   # Apply T-gate to qubit 0
qc.tdg(0) # Apply Tdg-gate to qubit 0
qc.draw()

You can use the widget below to play around with all the gates introduced in this chapter so far:

# Run the code in this cell to see the widget
from qiskit_textbook.widgets import gate_demo
gate_demo()
VBox(children=(HBox(children=(Button(description='I', layout=Layout(height='3em', width='3em'), style=ButtonSt…
Image(value=b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x01 \x00\x00\x01 \x08\x06\x00\x00\x00\x14\x83\xae\x8…
7. The U-gate
As we saw earlier, the I, Z, S & T-gates were all special cases of the more general P-gate. In the same way, the U-gate is the most general of all single-qubit quantum gates. It is a parametrised gate of the form:

 
 
 
 
 

Every gate in this chapter could be specified as 
, but it is unusual to see this in a circuit diagram, possibly due to the difficulty in reading this.

As an example, we see some specific cases of the U-gate in which it is equivalent to the H-gate and P-gate respectively.

 
 
 		 
 
 

# Let's have U-gate transform a |0> to |+> state
qc = QuantumCircuit(1)
qc.u(pi/2, 0, pi, 0)
qc.draw()

# Let's see the result
qc.save_statevector()
qobj = assemble(qc)
state = sim.run(qobj).result().get_statevector()
plot_bloch_multivector(state)

It should be obvious from this that there are an infinite number of possible gates, and that this also includes Rx and Ry-gates, although they are not mentioned here. It must also be noted that there is nothing special about the Z-basis, except that it has been selected as the standard computational basis. Qiskit also provides the X equivalent of the S and Sdg-gate i.e. the SX-gate and SXdg-gate respectively. These gates do a quarter-turn with respect to the X-axis around the Bloch sphere and are a special case of the Rx-gate.

Before running on real IBM quantum hardware, all single-qubit operations are compiled down to 
 , 
, 
 and 
 . For this reason they are sometimes called the physical gates.

8. Additional resources
You can find a community-created cheat-sheet with some of the common quantum gates, and their properties here.

import qiskit.tools.jupyter
%qiskit_version_table
Version Information
Qiskit Software	Version
Qiskit	0.27.0
Terra	0.17.4
Aer	0.8.2
Ignis	0.6.0
Aqua	0.9.2
IBM Q Provider	0.14.0
System information
Python	3.8.10 | packaged by conda-forge | (default, May 11 2021, 07:01:05) [GCC 9.3.0]
OS	Linux
CPUs	8
Memory (Gb)	31.40896224975586
Tue Jul 13 02:37:13 2021 UTC