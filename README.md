# Service discovery workshop
This project demonstrated service discovry mechanism using service disc. software
called consul.

## Problem:
	Monolithic services typically have several modules that communicate with each other
	using some application level mechanisms like: method invocations, procedure calls etc.
	In distributed, microservices, systems parts of services are distributed accross the network let's say we have 
	services : A, B, C
	
	A ----(network call)-----> B
	
	B ----(network call)-----> C
	
	At first glance we can describe the behaviour of this system next way: Each service knows predefined ip address
	of each machine where other services run to communicate with them via network calls.
	This assumption is definetly interesting and working but only in certain cases. 
	In the modern, cloud, microservices world depending on the load and stress level of the system  there might be different 
	numbers of each microservices. So it can be the case that servies are next: 3 X A, 2 X B, C.
	In this case the  topology of our network of services becomes dynamic instead of having static ip addresses of services,
	and the main reason for this is  a dependency of network topology on some outer factors(like system load...etc.)
	
	How can client of our services discover locations of different instances of dynamic services?
## Solution:
	Service discovery pattern. Cerntralized storage, catalogue, dictionary of services.
	Each new instance programtaically registers itself and it's ip address in service discovery upon coming to life.
	Upon death/shut down of an instance of a service, instance deregisters itself from service discovery catalogue.

	We'll store a load balancer in front of our services. We'll make it public, every client will go to loadBalancer for querying services,
	loadBalancer will fetch all updated data from service registry and depending on the logic of querid url by client will forward request
	to appropriate service instnace.


# Useful links
https://microservices.io/patterns/server-side-discovery.html 
	
		
