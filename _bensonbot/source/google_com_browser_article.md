---
title: "What happens when you type https://www.google.com in your browser and press Enter?"
---
In this article, I discuss What happens when you type https://www.google.com in your browser and press Enter?

Computers and other devices communicate using IP addresses to identify each other on the internet. But humans can’t remember IP addresses, so they use words (URLs) instead: such as www.google.com. The domain name system (DNS) brings the two together and gets you to your destination. DNS is, in simple words, the technology that translates human-adapted, text-based domain names to machine-adapted, numerical-based IP. Once you type the URL in the browser, the browser first checks if it knows that URL then it asks the computer’s OS. If the OS doesn’t know then it asks the resolver server (which is usually the Internet Service Provider). All resolvers must know one thing: where to locate the root server.At this stage, your local computer (the client) is making requests over the internet. To do this, it follows certain protocols.

TCP/IP is a suite of protocols used by devices to communicate over the Internet and most local networks. It is named after two of it’s original protocols — the Transmission Control Protocol (TCP) and the Internet Protocol (IP). TCP provides apps a way to deliver (and receive) an ordered and error-checked stream of information packets over the network.The term “packets” describes the format in which the data is sent from server to client. What do we mean here? Basically, when data is sent across the web, it is sent in thousands of small chunks. There are multiple reasons why data is sent in small packets. They are sometimes dropped or corrupted, and it’s easier to replace small chunks when this happens. Additionally, the packets can be routed along different paths, making the exchange faster and allowing many different users to download the same website at the same time. If each website was sent as a single big chunk, only one user could download it at a time, which obviously would make the web very inefficient and not much fun to use.

The resolver then asks the root server. (The root server knows where to locate the .COM TLD server. TLD stands for Top-Level Domain.)The root server gives the resolver the location of the .COM TLD server & the resolver saves it so that it doesn’t need to come back to the root server again.


There are 13 root servers that exist today. They are scattered around the globe and operated by 12 independent organizations.They are named [letter].root-servers.net where [letter] ranges from A to M. This doesn’t mean that we have only 13 physical servers to support the whole internet! Each organization provides multiple physical servers distributed around the globe.

The resolver then heads to the .COM TLD server and asks about the URL. The coordination of most top-level domains (TLDs) belong to the Internet Corporation for Assigned Names and Numbers (ICANN). The .COM TLD was one of the first created in 1985 and today it is the largest TLD in the internet. Other types of TLDs include:

→ Country code TLDs.Usually, their 2 letter ISO code such as .au for Australia & .uk for the United Kingdom

→ Internationalized country code TLDs. (TLDs written in native languages)

→ Generic TLDs: .NET, .ORG, .EDU, etc…(Usually with 3 or more letters)

Become a member
→ Infrastructure TLDs: .ARPA, mostly used for reverse DNS lookups.

→ (And today, many new generic TLDs are being created!)

The . COM TLD server directs the resolver to the name server and the resolver saves this location. The .COM TLD server is able to make this connection with the help of the Domain registrar. When a domain is purchased, the domain registrar reserves the name and communicates to the TLD registry the authoritative name servers.The authoritative name server gives the resolver the IP address of the URL and the resolver starts its way back after saving that information. The resolver communicates its findings (The .COM server from the root, the authoritative name server address from the .COM TLD server and finally the IP address of the URL from the authoritative name server) to the OS which then relays it to the browser. The browser then queries the IP address given using a http request for the code (HTML, CSS, JS).

HyperText Transfer Protocol Secure (HTTPS) is the secure version of HTTP, the protocol over which data is sent between your browser and the website that you are connected to. The ‘S’ at the end of HTTPS stands for ‘Secure’. It means all communications between your browser and the website are encrypted. HTTPS is often used to protect highly confidential online transactions like online banking and online shopping order forms.

When you request a HTTPS connection to a webpage, the website will initially send its SSL certificate to your browser. This certificate contains the public key needed to begin the secure session. Based on this initial exchange, your browser and the website then initiate the ‘SSL handshake’. The SSL handshake involves the generation of shared secrets to establish a uniquely secure connection between yourself and the website.

When a trusted SSL Digital Certificate is used during a HTTPS connection, users will see a padlock icon in the browser address bar. When an Extended Validation Certificate is installed on a web site, the address bar will turn green.

A web server is a software that responds to HTTP requests from client computers and delivers web pages whereas an application server is system software that resides between the operating system (OS) on one side, the external resources (such as a database management system [DBMS], communications and Internet services) on another side and the users’ applications on the third side. Ever wonder how Facebook, Linkedin, Twitter and other web giants are handling such huge amounts of traffic? They don’t have just one server, but tens of thousands of them. In order to achieve this, web traffic needs to be distributed to these servers, and that is the role of a load-balancer.

Press enter or click to view image in full size

Apart from the files containing the static code (codebase), most websites have a database that collects and stores data from users. This database together with the application server makes the dynamic part of the website.

The results of the http requests are then loaded onto the webpage depending on the settings of any available firewall. A firewall is a division between a private network and an outer network, often the internet, that manages traffic passing between the two networks. It’s implemented through either hardware or software. Firewalls allow, limit, and block network traffic based on preconfigured rules in the hardware or software, analysing data packets that request entry to the network. In addition to limiting access to computers and networks, a firewall is also useful for allowing remote access to a private network through secure authentication certificates and logins.
