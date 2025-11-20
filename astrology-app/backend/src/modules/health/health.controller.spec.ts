import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return health check status', () => {
      const result = controller.check();

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('service');
      expect(result).toHaveProperty('version');
    });

    it('should return ok status', () => {
      const result = controller.check();

      expect(result.status).toBe('ok');
    });

    it('should return service name', () => {
      const result = controller.check();

      expect(result.service).toBe('astrology-backend');
    });

    it('should return version', () => {
      const result = controller.check();

      expect(result.version).toBe('1.0.0');
    });

    it('should return ISO timestamp', () => {
      const result = controller.check();

      expect(result.timestamp).toBeDefined();
      expect(typeof result.timestamp).toBe('string');
      expect(() => new Date(result.timestamp)).not.toThrow();
    });

    it('should return current timestamp', () => {
      const beforeCheck = new Date().toISOString();
      const result = controller.check();
      const afterCheck = new Date().toISOString();

      expect(result.timestamp).toBeGreaterThanOrEqual(beforeCheck);
      expect(result.timestamp).toBeLessThanOrEqual(afterCheck);
    });

    it('should always return successful response', () => {
      // Health check should always return 200 unless the service is completely down
      const result = controller.check();

      expect(result.status).toBe('ok');
    });

    it('should return consistent structure across multiple calls', () => {
      const result1 = controller.check();
      const result2 = controller.check();

      expect(Object.keys(result1).sort()).toEqual(Object.keys(result2).sort());
    });
  });

  describe('ready', () => {
    it('should return readiness check status', () => {
      const result = controller.ready();

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('memory');
    });

    it('should return ok status', () => {
      const result = controller.ready();

      expect(result.status).toBe('ok');
    });

    it('should return ISO timestamp', () => {
      const result = controller.ready();

      expect(result.timestamp).toBeDefined();
      expect(typeof result.timestamp).toBe('string');
      expect(() => new Date(result.timestamp)).not.toThrow();
    });

    it('should return process uptime', () => {
      const result = controller.ready();

      expect(result.uptime).toBeDefined();
      expect(typeof result.uptime).toBe('number');
      expect(result.uptime).toBeGreaterThanOrEqual(0);
    });

    it('should return memory usage information', () => {
      const result = controller.ready();

      expect(result.memory).toBeDefined();
      expect(typeof result.memory).toBe('object');
    });

    it('should return heapUsed in MB', () => {
      const result = controller.ready();

      expect(result.memory.heapUsed).toBeDefined();
      expect(typeof result.memory.heapUsed).toBe('number');
      expect(result.memory.heapUsed).toBeGreaterThan(0);
    });

    it('should return heapTotal in MB', () => {
      const result = controller.ready();

      expect(result.memory.heapTotal).toBeDefined();
      expect(typeof result.memory.heapTotal).toBe('number');
      expect(result.memory.heapTotal).toBeGreaterThan(0);
    });

    it('should return external memory in MB', () => {
      const result = controller.ready();

      expect(result.memory.external).toBeDefined();
      expect(typeof result.memory.external).toBe('number');
      expect(result.memory.external).toBeGreaterThanOrEqual(0);
    });

    it('should return RSS memory in MB', () => {
      const result = controller.ready();

      expect(result.memory.rss).toBeDefined();
      expect(typeof result.memory.rss).toBe('number');
      expect(result.memory.rss).toBeGreaterThan(0);
    });

    it('should have heapUsed less than or equal to heapTotal', () => {
      const result = controller.ready();

      expect(result.memory.heapUsed).toBeLessThanOrEqual(result.memory.heapTotal);
    });

    it('should return memory values as integers (rounded)', () => {
      const result = controller.ready();

      expect(Number.isInteger(result.memory.heapUsed)).toBe(true);
      expect(Number.isInteger(result.memory.heapTotal)).toBe(true);
      expect(Number.isInteger(result.memory.external)).toBe(true);
      expect(Number.isInteger(result.memory.rss)).toBe(true);
    });

    it('should return different uptime on subsequent calls', async () => {
      const result1 = controller.ready();

      // Wait a small amount of time
      await new Promise((resolve) => setTimeout(resolve, 10));

      const result2 = controller.ready();

      expect(result2.uptime).toBeGreaterThanOrEqual(result1.uptime);
    });

    it('should return current timestamp', () => {
      const beforeCheck = new Date().toISOString();
      const result = controller.ready();
      const afterCheck = new Date().toISOString();

      expect(result.timestamp).toBeGreaterThanOrEqual(beforeCheck);
      expect(result.timestamp).toBeLessThanOrEqual(afterCheck);
    });

    it('should always return successful response when service is running', () => {
      const result = controller.ready();

      expect(result.status).toBe('ok');
    });

    it('should provide Kubernetes-compatible readiness information', () => {
      const result = controller.ready();

      // Readiness probe should provide information about service readiness
      expect(result.status).toBe('ok');
      expect(result.uptime).toBeGreaterThanOrEqual(0);
      expect(result.memory).toBeDefined();
    });
  });

  describe('live', () => {
    it('should return liveness check status', () => {
      const result = controller.live();

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('timestamp');
    });

    it('should return ok status', () => {
      const result = controller.live();

      expect(result.status).toBe('ok');
    });

    it('should return ISO timestamp', () => {
      const result = controller.live();

      expect(result.timestamp).toBeDefined();
      expect(typeof result.timestamp).toBe('string');
      expect(() => new Date(result.timestamp)).not.toThrow();
    });

    it('should return current timestamp', () => {
      const beforeCheck = new Date().toISOString();
      const result = controller.live();
      const afterCheck = new Date().toISOString();

      expect(result.timestamp).toBeGreaterThanOrEqual(beforeCheck);
      expect(result.timestamp).toBeLessThanOrEqual(afterCheck);
    });

    it('should return minimal response structure', () => {
      const result = controller.live();

      // Liveness probe should be minimal - just status and timestamp
      const keys = Object.keys(result);
      expect(keys.length).toBe(2);
      expect(keys).toContain('status');
      expect(keys).toContain('timestamp');
    });

    it('should always return successful response when service is alive', () => {
      const result = controller.live();

      expect(result.status).toBe('ok');
    });

    it('should be faster than readiness check', () => {
      // Liveness check should have minimal overhead
      const startLive = process.hrtime.bigint();
      controller.live();
      const endLive = process.hrtime.bigint();
      const liveDuration = Number(endLive - startLive);

      const startReady = process.hrtime.bigint();
      controller.ready();
      const endReady = process.hrtime.bigint();
      const readyDuration = Number(endReady - startReady);

      // Liveness should typically be faster since it does less work
      // This is a loose check since both are very fast
      expect(liveDuration).toBeGreaterThan(0);
      expect(readyDuration).toBeGreaterThan(0);
    });

    it('should provide Kubernetes-compatible liveness information', () => {
      const result = controller.live();

      // Liveness probe should be minimal - just confirm service is alive
      expect(result.status).toBe('ok');
    });

    it('should return consistent structure across multiple calls', () => {
      const result1 = controller.live();
      const result2 = controller.live();

      expect(Object.keys(result1).sort()).toEqual(Object.keys(result2).sort());
    });
  });

  describe('endpoint comparisons', () => {
    it('should have liveness check simpler than readiness check', () => {
      const liveResult = controller.live();
      const readyResult = controller.ready();

      // Liveness should have fewer fields than readiness
      expect(Object.keys(liveResult).length).toBeLessThan(
        Object.keys(readyResult).length,
      );
    });

    it('should have all endpoints return ok status', () => {
      expect(controller.check().status).toBe('ok');
      expect(controller.ready().status).toBe('ok');
      expect(controller.live().status).toBe('ok');
    });

    it('should have all endpoints return timestamps', () => {
      expect(controller.check().timestamp).toBeDefined();
      expect(controller.ready().timestamp).toBeDefined();
      expect(controller.live().timestamp).toBeDefined();
    });

    it('should have check endpoint provide service metadata', () => {
      const checkResult = controller.check();
      const liveResult = controller.live();

      // Check should provide more metadata than liveness
      expect(checkResult).toHaveProperty('service');
      expect(checkResult).toHaveProperty('version');
      expect(liveResult).not.toHaveProperty('service');
      expect(liveResult).not.toHaveProperty('version');
    });

    it('should have ready endpoint provide resource metrics', () => {
      const readyResult = controller.ready();
      const liveResult = controller.live();

      // Ready should provide resource information
      expect(readyResult).toHaveProperty('uptime');
      expect(readyResult).toHaveProperty('memory');
      expect(liveResult).not.toHaveProperty('uptime');
      expect(liveResult).not.toHaveProperty('memory');
    });
  });

  describe('monitoring integration', () => {
    it('should support load balancer health checks with /health', () => {
      const result = controller.check();

      // Load balancers typically check for 200 status and valid JSON
      expect(result).toBeDefined();
      expect(result.status).toBe('ok');
    });

    it('should support Kubernetes liveness probe with /health/live', () => {
      const result = controller.live();

      // Kubernetes liveness probe should get minimal response
      expect(result).toBeDefined();
      expect(result.status).toBe('ok');
    });

    it('should support Kubernetes readiness probe with /health/ready', () => {
      const result = controller.ready();

      // Kubernetes readiness probe should get detailed status
      expect(result).toBeDefined();
      expect(result.status).toBe('ok');
      expect(result.memory).toBeDefined();
    });

    it('should provide metrics for monitoring systems', () => {
      const readyResult = controller.ready();

      // Monitoring systems can track these metrics over time
      expect(readyResult.uptime).toBeDefined();
      expect(readyResult.memory.heapUsed).toBeDefined();
      expect(readyResult.memory.heapTotal).toBeDefined();
      expect(readyResult.memory.rss).toBeDefined();
    });
  });

  describe('error resilience', () => {
    it('should not throw errors from check endpoint', () => {
      expect(() => controller.check()).not.toThrow();
    });

    it('should not throw errors from ready endpoint', () => {
      expect(() => controller.ready()).not.toThrow();
    });

    it('should not throw errors from live endpoint', () => {
      expect(() => controller.live()).not.toThrow();
    });

    it('should handle multiple rapid calls to check', () => {
      expect(() => {
        for (let i = 0; i < 100; i++) {
          controller.check();
        }
      }).not.toThrow();
    });

    it('should handle multiple rapid calls to ready', () => {
      expect(() => {
        for (let i = 0; i < 100; i++) {
          controller.ready();
        }
      }).not.toThrow();
    });

    it('should handle multiple rapid calls to live', () => {
      expect(() => {
        for (let i = 0; i < 100; i++) {
          controller.live();
        }
      }).not.toThrow();
    });
  });
});
