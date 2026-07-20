import React from 'react';
import { Wrench, Cuboid, Globe2, Unlock, Factory, PlusSquare, UserCheck, Rocket, Handshake, Calendar, Cpu, Eye, Brain, ArrowUpDown, Paperclip, CheckCircle2, FileStack, Box, Anchor, CreditCard, Lock, KeyRound, Gift, RefreshCcw, Dices, Car, Shield, FileText, Plug, ArrowDownToLine, BoxSelect, Key, Network, Dna, FlaskConical, Activity, Combine, Wind, DoorOpen, ListOrdered, LayoutTemplate, PlaySquare, Monitor, Archive, TrendingUp, Mail, Hammer, Waves, DatabaseZap, Receipt, Banknote, Pizza, MessageSquare, Radio, Recycle, Target, Building2, TrafficCone, Settings, Map, Link, Feather, FireExtinguisher, Scale, Database } from 'lucide-react';
import './SystemDesign.css';

const sdData = [
  {
    icon: <Building2 size={20} />,
    title: 'LLD Interview Prep',
    count: '11',
    subtitle: 'Recommended learning path — work top to bottom (11 topics)',
    topics: [
      { icon: <Archive size={16} />, title: '1 · LRU Cache', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <ArrowUpDown size={16} />, title: '11 · Elevator', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Car size={16} />, title: '2 · Parking Lot', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <CreditCard size={16} />, title: '5 · ATM Machine', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Banknote size={16} />, title: '6 · Splitwise', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <PlaySquare size={16} />, title: '7 · BookMyShow', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Pizza size={16} />, title: '8 · Food Delivery', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <TrafficCone size={16} />, title: '9 · Rate Limiter', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Calendar size={16} />, title: '10 · Meeting Scheduler', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <Dices size={16} />, title: '3 · Snake & Ladder', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <FileText size={16} />, title: '4 · Design a Logger', priority: 'Important', priorityClass: 'sd-prio-important' },
    ]
  },
  {
    icon: <Cpu size={20} />,
    title: 'Concurrency & Threading',
    count: '15',
    subtitle: 'Recommended learning path — work top to bottom (15 topics)',
    topics: [
      { icon: <Brain size={16} />, title: '1 · Concurrency Basics', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Map size={16} />, title: '10 · ConcurrentHashMap & Collections', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Wrench size={16} />, title: '2 · Synchronization (Types & Use Cases)', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Radio size={16} />, title: '3 · volatile Keyword', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <FlaskConical size={16} />, title: '4 · volatile / atomic / transient', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Key size={16} />, title: '5 · synchronized vs ReentrantLock', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Paperclip size={16} />, title: '7 · Thread Pools & ExecutorService', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Link size={16} />, title: '9 · CompletableFuture & Async Composition', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <FireExtinguisher size={16} />, title: '6 · Deadlock / Livelock / Starvation', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <Box size={16} />, title: '8 · BlockingQueue', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <Settings size={16} />, title: '11 · HashMap vs ConcurrentHashMap', priority: 'Advanced', priorityClass: 'sd-prio-advanced' },
      { icon: <Feather size={16} />, title: '14 · Virtual Threads (Java 21)', priority: 'Advanced', priorityClass: 'sd-prio-advanced' },
      { icon: <Recycle size={16} />, title: '15 · JVM / GC Overview', priority: 'Advanced', priorityClass: 'sd-prio-advanced' },
      { icon: <Wind size={16} />, title: '12 · WeakHashMap', priority: 'Specialized', priorityClass: 'sd-prio-specialized' },
      { icon: <Paperclip size={16} />, title: '13 · Weak / Soft / Phantom Reference', priority: 'Specialized', priorityClass: 'sd-prio-specialized' },
    ]
  },
  {
    icon: <Globe2 size={20} />,
    title: 'Networking & Realtime',
    count: '7',
    subtitle: 'Recommended learning path — work top to bottom (7 topics)',
    topics: [
      { icon: <Scale size={16} />, title: '1 · REST vs gRPC', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <KeyRound size={16} />, title: '3 · JWT vs Session / OAuth', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Key size={16} />, title: '4 · Authentication & Authorization', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <DoorOpen size={16} />, title: '5 · API Gateway', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Rocket size={16} />, title: '2 · gRPC', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <Anchor size={16} />, title: '6 · Webhook', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <Globe2 size={16} />, title: '7 · WebSocket', priority: 'Important', priorityClass: 'sd-prio-important' },
    ]
  },
  {
    icon: <Database size={20} />,
    title: 'Databases & API Data Access',
    count: '6',
    subtitle: 'Indexes, transactions, and pagination',
    topics: [
      { icon: <ListOrdered size={16} />, title: 'Database Indexing', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <PlusSquare size={16} />, title: 'N+1 Queries & Batching', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <FileStack size={16} />, title: 'Pagination Strategies', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Receipt size={16} />, title: 'Transactions & Isolation', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Waves size={16} />, title: 'Connection Pooling (HikariCP)', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <BoxSelect size={16} />, title: 'Database Sharding & Partitioning', priority: 'Advanced', priorityClass: 'sd-prio-advanced' },
    ]
  },
  {
    icon: <Shield size={20} />,
    title: 'Reliability & Scalability',
    count: '7',
    subtitle: 'Correctness under retries and load',
    topics: [
      { icon: <CheckCircle2 size={16} />, title: 'Caching Patterns', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <FireExtinguisher size={16} />, title: 'Fault Tolerance (Recover from Failures Gracefully)', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Recycle size={16} />, title: 'Idempotency', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <TrafficCone size={16} />, title: 'Rate Limiting', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Shield size={16} />, title: 'Circuit Breaker / Retry / Bulkhead', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <BoxSelect size={16} />, title: 'Circuit Breakers & Retries (Resilience4j)', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <Lock size={16} />, title: 'Distributed Locks', priority: 'Advanced', priorityClass: 'sd-prio-advanced' },
    ]
  },
  {
    icon: <Cuboid size={20} />,
    title: 'SOLID Principles',
    count: '6',
    subtitle: 'Five rules every senior engineer should live by',
    topics: [
      { icon: <Link size={16} />, title: 'Class Relationships', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <ArrowDownToLine size={16} />, title: 'Dependency Inversion (D)', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Target size={16} />, title: 'Single Responsibility (S)', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Plug size={16} />, title: 'Interface Segregation (I)', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <RefreshCcw size={16} />, title: 'Liskov Substitution (L)', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <Unlock size={16} />, title: 'Open / Closed (O)', priority: 'Important', priorityClass: 'sd-prio-important' },
    ]
  },
  {
    icon: <Hammer size={20} />,
    title: 'Creational Patterns',
    count: '5',
    subtitle: 'How objects are born',
    topics: [
      { icon: <Cuboid size={16} />, title: 'Builder', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Factory size={16} />, title: 'Factory Method', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Lock size={16} />, title: 'Singleton', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Combine size={16} />, title: 'Abstract Factory', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <Dna size={16} />, title: 'Prototype', priority: 'Optional', priorityClass: 'sd-prio-optional' },
    ]
  },
  {
    icon: <LayoutTemplate size={20} />,
    title: 'Architecture Styles',
    count: '10',
    subtitle: 'Service design, data flow, and engineering practices',
    topics: [
      { icon: <Target size={16} />, title: 'Framework For System Design Interviews', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <TrendingUp size={16} />, title: 'Scale From Zero To Millions Of Users', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Scale size={16} />, title: 'Trade-offs in System Design', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Box size={16} />, title: 'Docker Fundamentals', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <FlaskConical size={16} />, title: 'JUnit Testing in Spring Boot', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <DatabaseZap size={16} />, title: 'Redis Fundamentals', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <BoxSelect size={16} />, title: 'CQRS Pattern', priority: 'Advanced', priorityClass: 'sd-prio-advanced' },
      { icon: <Receipt size={16} />, title: 'SAGA Pattern', priority: 'Advanced', priorityClass: 'sd-prio-advanced' },
      { icon: <Activity size={16} />, title: 'Zero Downtime Deployment Strategies', priority: 'Advanced', priorityClass: 'sd-prio-advanced' },
      { icon: <Brain size={16} />, title: 'CQRS / Event Sourcing (Overview)', priority: 'Specialized', priorityClass: 'sd-prio-specialized' },
    ]
  },
  {
    icon: <Combine size={20} />,
    title: 'Behavioral Patterns',
    count: '9',
    subtitle: 'How objects collaborate',
    topics: [
      { icon: <Eye size={16} />, title: 'Observer', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Target size={16} />, title: 'Strategy', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Link size={16} />, title: 'Chain of Responsibility', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <Box size={16} />, title: 'Command', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <PlaySquare size={16} />, title: 'State', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <Handshake size={16} />, title: 'Mediator', priority: 'Optional', priorityClass: 'sd-prio-optional' },
      { icon: <Brain size={16} />, title: 'Memento', priority: 'Optional', priorityClass: 'sd-prio-optional' },
      { icon: <LayoutTemplate size={16} />, title: 'Template Method', priority: 'Optional', priorityClass: 'sd-prio-optional' },
      { icon: <UserCheck size={16} />, title: 'Visitor', priority: 'Optional', priorityClass: 'sd-prio-optional' },
    ]
  },
  {
    icon: <BoxSelect size={20} />,
    title: 'Structural Patterns',
    count: '5',
    subtitle: 'How objects fit together',
    topics: [
      { icon: <Gift size={16} />, title: 'Decorator', priority: 'Must Know', priorityClass: 'sd-prio-must-know' },
      { icon: <Plug size={16} />, title: 'Adapter', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <Monitor size={16} />, title: 'Facade', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <Shield size={16} />, title: 'Proxy', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <Network size={16} />, title: 'Composite', priority: 'Optional', priorityClass: 'sd-prio-optional' },
    ]
  },
  {
    icon: <MessageSquare size={20} />,
    title: 'Messaging & Streaming',
    count: '4',
    subtitle: 'Event pipelines and stream processing',
    topics: [
      { icon: <Paperclip size={16} />, title: 'Kafka Basics', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <MessageSquare size={16} />, title: 'Queue-Based Systems (RabbitMQ vs Kafka)', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <Mail size={16} />, title: 'SQS Basics', priority: 'Important', priorityClass: 'sd-prio-important' },
      { icon: <Scale size={16} />, title: 'SQS vs RabbitMQ', priority: 'Important', priorityClass: 'sd-prio-important' },
    ]
  },
];

export function SystemDesign() {
  return (
    <main className="sd-page">
      
      <div className="sd-hero">
        <h1 className="sd-hero-title">System Design & LLD</h1>
        <p className="sd-hero-subtitle">Master the art of scalable architecture with our structured learning path.</p>
      </div>

      <div className="sd-welcome-grid">
        {sdData.map((card, idx) => (
          <div key={idx} className="sd-welcome-card glassmorphism">
            <div className="sd-welcome-card-h">
              <span className="sd-welcome-card-ico">{card.icon}</span>
              <span className="sd-welcome-card-t">{card.title}</span>
              <span className="sd-welcome-card-cnt">{card.count}</span>
            </div>
            <div className="sd-welcome-card-sub">{card.subtitle}</div>
            <div className="sd-welcome-card-list">
              {card.topics.map((topic, tidx) => (
                <button key={tidx} type="button" className="sd-welcome-pill" title="Open">
                  <span className="pill-ico">{topic.icon}</span>
                  <span className="pill-t">{topic.title}</span>
                  <span className={`sd-priority-chip ${topic.priorityClass}`}>{topic.priority}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
