function createRateLimiter(fn, limit, intervalMs) {
    const callTimestamps = []; // Stores timestamps of recent calls

    return function (...args) {
        const now = Date.now();

        // 1. Remove timestamps older than the interval
        const windowStart = now - intervalMs;
        let firstValidIndex = 0;
        while (firstValidIndex < callTimestamps.length && callTimestamps[firstValidIndex] < windowStart) {
            firstValidIndex++;
        }
        if (firstValidIndex > 0) {
            callTimestamps.splice(0, firstValidIndex);
        }

        // 2. Check if the limit has been reached
        if (callTimestamps.length < limit) {
            // 3. Add the current timestamp
            callTimestamps.push(now);
            // 4. Call the original function
            try {
                // console.log(`Call allowed. Count: ${callTimestamps.length}`); // Debug log
                return fn.apply(this, args);
            } catch (error) {
                console.error("Error during rate-limited function execution:", error);
                // Optional: Decide if a failed call should count towards the limit
                // callTimestamps.pop(); // Uncomment if a failed call shouldn't count
                throw error;
            }
        } else {
            // 5. Limit exceeded
            // console.warn(`Rate limit exceeded. Count: ${callTimestamps.length}`); // Debug log
            throw new Error("Rate limit exceeded");
        }
    };
}

function autoCallWithRateLimit(
    targetFn,           // The original function to call (e.g., foo)
    limit,              // Max calls for rate limiter
    intervalMs,         // Interval for rate limiter (e.g., 60000 for 1 min)
    argsProvider = () => [], // Function that provides args for each call
    context = null      // 'this' context for the targetFn if needed
) {
    const limitedFn = createRateLimiter(targetFn, limit, intervalMs);
    let timeoutId = null;
    let isRunning = false;

    // Calculate a reasonable max delay for randomness
    // Aim for an average delay around intervalMs / limit
    // Multiply by 2-3 for decent randomization range
    const averageInterval = intervalMs / limit;
    const maxRandomDelay = averageInterval * 2.5; // Adjust multiplier as needed
    const minRandomDelay = 10; // Prevent zero delay loops

    function scheduleNextCall() {
        if (!isRunning) return; // Stop if stop() was called

        const randomDelay = Math.random() * (maxRandomDelay - minRandomDelay) + minRandomDelay;

        timeoutId = setTimeout(() => {
            if (!isRunning) return; // Check again in case stop() was called during timeout

            try {
                const args = argsProvider(); // Get fresh arguments for this call
                limitedFn.apply(context, args); // Attempt the rate-limited call
                // If successful, the original targetFn gets called by limitedFn
            } catch (error) {
                if (error.message === "Rate limit exceeded") {
                    console.log("-> Blocked by rate limit. Scheduling next attempt.");
                    // Rate limit hit, just proceed to schedule the next call
                } else {
                    // An error occurred *within* the targetFn itself
                    console.error("-> Error during target function execution:", error);
                    // Decide if you want to stop on errors or continue
                    // stop(); // Uncomment to stop on any function error
                }
            } finally {
                // ALWAYS schedule the next attempt, regardless of success, rate limit block, or function error (unless stopped)
                if (isRunning) {
                    scheduleNextCall();
                }
            }
        }, randomDelay);
    }

    function start() {
        if (isRunning) {
            console.log("Auto-caller is already running.");
            return;
        }
        console.log(`Starting auto-caller for '${targetFn.name || 'anonymous'}' (Limit: ${limit}/${intervalMs}ms, Avg Interval: ${averageInterval.toFixed(0)}ms, Max Delay: ${maxRandomDelay.toFixed(0)}ms)`);
        isRunning = true;
        scheduleNextCall(); // Start the loop
    }

    function stop() {
        if (!isRunning) {
            console.log("Auto-caller is not running.");
            return;
        }
        console.log("Stopping auto-caller...");
        isRunning = false;
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    }

    // Return controls to start/stop the process
    return { start, stop };
}