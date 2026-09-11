
Multiple Qubits & Entangled States
Single qubits are interesting, but individually they offer no computational advantage. We will now look at how we represent multiple qubits, and how these qubits can interact with each other. We have seen how we can represent the state of a qubit using a 2D-vector, now we will see how we can represent the state of multiple qubits.

Contents
Representing Multi-Qubit States
1.1 Exercises
Single Qubit Gates on Multi-Qubit Statevectors
2.1 Exercises
Multi-Qubit Gates
3.1 The CNOT-gate
3.2 Entangled States
3.3 Visualizing Entangled States
3.4 Exercises
1. Representing Multi-Qubit States
We saw that a single bit has two possible states, and a qubit state has two complex amplitudes. Similarly, two bits have four possible states:

00 01 10 11

And to describe the state of two qubits requires four complex amplitudes. We store these amplitudes in a 4D-vector like so:

 

The rules of measurement still work in the same way:


And the same implications hold, such as the normalisation condition:


If we have two separated qubits, we can describe their collective state using the kronecker product:

  
 

 
 
 
 

And following the same rules, we can use the kronecker product to describe the collective state of any number of qubits. Here is an example with three qubits:

 

If we have 
 qubits, we will need to keep track of 
 complex amplitudes. As we can see, these vectors grow exponentially with the number of qubits. This is the reason quantum computers with large numbers of qubits are so difficult to simulate. A modern laptop can easily simulate a general quantum state of around 20 qubits, but simulating 100 qubits is too difficult for the largest supercomputers.

Let's look at an example circuit:

from qiskit import QuantumCircuit, Aer, assemble
import numpy as np
from qiskit.visualization import plot_histogram, plot_bloch_multivector
qc = QuantumCircuit(3)
# Apply H-gate to each qubit:
for qubit in range(3):
    qc.h(qubit)
# See the circuit:
qc.draw()
b'\n\n\n
Each qubit is in the state 
, so we should see the vector:

 
 

# Let's see the result
svsim = Aer.get_backend('aer_simulator')
qc.save_statevector()
qobj = assemble(qc)
final_state = svsim.run(qobj).result().get_statevector()

# In Jupyter Notebooks we can display this nicely using Latex.
# If not using Jupyter Notebooks you may need to remove the 
# array_to_latex function and use print(final_state) instead.
from qiskit.visualization import array_to_latex
array_to_latex(final_state, prefix="\\text{Statevector} = ")
 
 
 
 
 
 
 
 
 
And we have our expected result.

1.2 Quick Exercises:
Write down the kronecker product of the qubits:
a) 

b) 

c) 

d) 
Write the state: 
 
 
 as two separate qubits.
2. Single Qubit Gates on Multi-Qubit Statevectors
We have seen that an X-gate is represented by the matrix:

 

And that it acts on the state 
 as so:

  
  
 

but it may not be clear how an X-gate would act on a qubit in a multi-qubit vector. Fortunately, the rule is quite simple; just as we used the kronecker product to calculate multi-qubit statevectors, we use the tensor product to calculate matrices that act on these statevectors. For example, in the circuit below:

qc = QuantumCircuit(2)
qc.h(0)
qc.x(1)
qc.draw()
b'\n\n\n
we can represent the simultaneous operations (H & X) using their kronecker product:


The operation looks like this:

 
 
 

 
 	 
 
 	 
 
 

 
 

Which we can then apply to our 4D statevector 
. This can become quite messy, you will often see the clearer notation:

 

Instead of calculating this by hand, we can use Qiskit’s aer_simulator to calculate this for us. The Aer simulator multiplies all the gates in our circuit together to compile a single unitary matrix that performs the whole quantum circuit:

usim = Aer.get_backend('aer_simulator')
qc.save_unitary()
qobj = assemble(qc)
unitary = usim.run(qobj).result().get_unitary()
and view the results:

# In Jupyter Notebooks we can display this nicely using Latex.
# If not using Jupyter Notebooks you may need to remove the 
# array_to_latex function and use print(unitary) instead.
from qiskit.visualization import array_to_latex
array_to_latex(unitary, prefix="\\text{Circuit = }\n")
 
 
 
 
 
 
 
 
 
If we want to apply a gate to only one qubit at a time (such as in the circuit below), we describe this using kronecker product with the identity matrix, e.g.:


qc = QuantumCircuit(2)
qc.x(1)
qc.draw()
b'\n\n\n
# Simulate the unitary
usim = Aer.get_backend('aer_simulator')
qc.save_unitary()
qobj = assemble(qc)
unitary = usim.run(qobj).result().get_unitary()
# Display the results:
array_to_latex(unitary, prefix="\\text{Circuit = } ")
 
We can see Qiskit has performed the kronecker product:
 
 

2.1 Quick Exercises:
Calculate the single qubit unitary (
) created by the sequence of gates: 
. Use Qiskit's Aer simulator to check your results.
Try changing the gates in the circuit above. Calculate their kronecker product, and then check your answer using the Aer simulator.
Note: Different books, softwares and websites order their qubits differently. This means the kronecker product of the same circuit can look very different. Try to bear this in mind when consulting other sources.

3. Multi-Qubit Gates
Now we know how to represent the state of multiple qubits, we are now ready to learn how qubits interact with each other. An important two-qubit gate is the CNOT-gate.

3.1 The CNOT-Gate
You have come across this gate before in The Atoms of Computation. This gate is a conditional gate that performs an X-gate on the second qubit (target), if the state of the first qubit (control) is 
. The gate is drawn on a circuit like this, with q0 as the control and q1 as the target:

qc = QuantumCircuit(2)
# Apply CNOT
qc.cx(0,1)
# See the circuit:
qc.draw()
b'\n\n\n
When our qubits are not in superposition of 
 or 
 (behaving as classical bits), this gate is very simple and intuitive to understand. We can use the classical truth table:

Input (t,c)	Output (t,c)
00	00
01	11
10	10
11	01
And acting on our 4D-statevector, it has one of the two matrices:

 
 

depending on which qubit is the control and which is the target. Different books, simulators and papers order their qubits differently. In our case, the left matrix corresponds to the CNOT in the circuit above. This matrix swaps the amplitudes of 
 and 
 in our statevector:

 
 
 

We have seen how this acts on classical states, but let’s now see how it acts on a qubit in superposition. We will put one qubit in the state 
:

qc = QuantumCircuit(2)
# Apply H-gate to the first:
qc.h(0)
qc.draw()
b'\n\n\n
# Let's see the result:
svsim = Aer.get_backend('aer_simulator')
qc.save_statevector()
qobj = assemble(qc)
final_state = svsim.run(qobj).result().get_statevector()
# Print the statevector neatly:
array_to_latex(final_state, prefix="\\text{Statevector = }")
 
 
 
As expected, this produces the state 
:

 

And let’s see what happens when we apply the CNOT gate:

qc = QuantumCircuit(2)
# Apply H-gate to the first:
qc.h(0)
# Apply a CNOT:
qc.cx(0,1)
qc.draw()
b'\n\n\n
# Let's get the result:
qc.save_statevector()
qobj = assemble(qc)
result = svsim.run(qobj).result()
# Print the statevector neatly:
final_state = result.get_statevector()
array_to_latex(final_state, prefix="\\text{Statevector = }")
 
 
 
We see we have the state:

 

This state is very interesting to us, because it is entangled. This leads us neatly on to the next section.

3.2 Entangled States
We saw in the previous section we could create the state:

 

This is known as a Bell state. We can see that this state has 50% probability of being measured in the state 
, and 50% chance of being measured in the state 
. Most interestingly, it has a 0% chance of being measured in the states 
 or 
. We can see this in Qiskit:

plot_histogram(result.get_counts())
b'\n\n\n
This combined state cannot be written as two separate qubit states, which has interesting implications. Although our qubits are in superposition, measuring one will tell us the state of the other and collapse its superposition. For example, if we measured the top qubit and got the state 
, the collective state of our qubits changes like so:

 
 

Even if we separated these qubits light-years away, measuring one qubit collapses the superposition and appears to have an immediate effect on the other. This is the ‘spooky action at a distance’ that upset so many physicists in the early 20th century.

It’s important to note that the measurement result is random, and the measurement statistics of one qubit are not affected by any operation on the other qubit. Because of this, there is no way to use shared quantum states to communicate. This is known as the no-communication theorem.[1]

3.3 Visualizing Entangled States
We have seen that this state cannot be written as two separate qubit states, this also means we lose information when we try to plot our state on separate Bloch spheres:

plot_bloch_multivector(final_state)
b'\n\n\n
Given how we defined the Bloch sphere in the earlier chapters, it may not be clear how Qiskit even calculates the Bloch vectors with entangled qubits like this. In the single-qubit case, the position of the Bloch vector along an axis nicely corresponds to the expectation value of measuring in that basis. If we take this as the rule of plotting Bloch vectors, we arrive at this conclusion above. This shows us there is no single-qubit measurement basis for which a specific measurement is guaranteed. This contrasts with our single qubit states, in which we could always pick a single-qubit basis. Looking at the individual qubits in this way, we miss the important effect of correlation between the qubits. We cannot distinguish between different entangled states. For example, the two states:

 
 

will both look the same on these separate Bloch spheres, despite being very different states with different measurement outcomes.

How else could we visualize this statevector? This statevector is simply a collection of four amplitudes (complex numbers), and there are endless ways we can map this to an image. One such visualization is the Q-sphere, here each amplitude is represented by a blob on the surface of a sphere. The size of the blob is proportional to the magnitude of the amplitude, and the colour is proportional to the phase of the amplitude. The amplitudes for 
 and 
 are equal, and all other amplitudes are 0:

from qiskit.visualization import plot_state_qsphere
plot_state_qsphere(final_state)
b'\n\n\n
Here we can clearly see the correlation between the qubits. The Q-sphere's shape has no significance, it is simply a nice way of arranging our blobs; the number of 0s in the state is proportional to the states position on the Z-axis, so here we can see the amplitude of 
 is at the top pole of the sphere, and the amplitude of 
 is at the bottom pole of the sphere.

3.4 Exercise:
Create a quantum circuit that produces the Bell state: 
 
. Use the statevector simulator to verify your result.

The circuit you created in question 1 transforms the state 
 to 
 
, calculate the unitary of this circuit using Qiskit's simulator. Verify this unitary does in fact perform the correct transformation.

Think about other ways you could represent a statevector visually. Can you design an interesting visualization from which you can read the magnitude and phase of each amplitude?

4. References
[1] Asher Peres, Daniel R. Terno, Quantum Information and Relativity Theory, 2004, https://arxiv.org/abs/quant-ph/0212023

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
Python	3.7.7 (default, May 6 2020, 04:59:01) [Clang 4.0.1 (tags/RELEASE_401/final)]
OS	Darwin
CPUs	8
Memory (Gb)	32.0
Thu Jun 17 15:13:01 2021 BST