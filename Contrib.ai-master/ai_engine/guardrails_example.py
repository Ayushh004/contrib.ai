"""
Quick example demonstrating how to use the guardrails system.
This file shows the basic usage patterns for the security features.
"""

from guardrails import InputGuardrails, OutputGuardrails, LLMGuardrailChain, RateLimiter

def demonstrate_input_guardrails():
    """Example of input validation and sanitization"""
    print("=== Input Guardrails Demo ===\n")
    
    input_guardrails = InputGuardrails()
    
    # Test cases
    test_inputs = [
        "How do I implement authentication?",
        "<script>alert('xss')</script>",  # XSS attempt
        "' UNION SELECT * FROM users--",  # SQL injection
        "   Too much    whitespace   ",  # Whitespace normalization
        "",  # Empty input
    ]
    
    for test_input in test_inputs:
        is_valid, error = input_guardrails.validate_input(test_input)
        sanitized = input_guardrails.sanitize_input(test_input)
        
        print(f"Input: {test_input[:50]}...")
        print(f"Valid: {is_valid}, Error: {error}")
        print(f"Sanitized: {sanitized[:50]}...")
        print("-" * 50)


def demonstrate_output_guardrails():
    """Example of output validation and filtering"""
    print("\n=== Output Guardrails Demo ===\n")
    
    output_guardrails = OutputGuardrails()
    
    # Test cases
    test_outputs = [
        "Here's the code you requested: function example() { return 42; }",
        "Check this: <script>alert('hack')</script>",  # Contains script
        "Your API key is: sk-1234567890abcdefghij",  # Contains API key
        "A" * 15000,  # Excessive length
    ]
    
    for test_output in test_outputs:
        is_valid, error = output_guardrails.validate_output(test_output)
        filtered = output_guardrails.filter_sensitive_info(test_output)
        
        print(f"Output: {test_output[:50]}...")
        print(f"Valid: {is_valid}, Error: {error}")
        print(f"Filtered: {filtered[:50]}...")
        print("-" * 50)


def demonstrate_llm_guardrail_chain():
    """Example of using the full guardrail chain with LLM"""
    print("\n=== LLM Guardrail Chain Demo ===\n")
    
    guardrail_system = LLMGuardrailChain()
    
    # Mock LLM chain for demonstration
    def mock_llm_chain(query):
        return f"Here's an answer for: {query}"
    
    # Test with guardrails
    test_query = "How do I implement secure authentication?"
    
    result = guardrail_system.process_with_guardrails(
        query=test_query,
        llm_chain=mock_llm_chain,
        use_llm_validation=False  # Set to True for LLM-based validation
    )
    
    print(f"Query: {test_query}")
    print(f"Success: {result['success']}")
    print(f"Result: {result['result']}")
    print(f"Warnings: {result.get('warnings', [])}")


def demonstrate_rate_limiter():
    """Example of rate limiting"""
    print("\n=== Rate Limiter Demo ===\n")
    
    rate_limiter = RateLimiter(max_requests=3, window_seconds=60)
    
    user_id = "user123"
    
    for i in range(5):
        is_allowed, error = rate_limiter.is_allowed(user_id)
        print(f"Request {i+1}: Allowed={is_allowed}, Error={error}")


if __name__ == "__main__":
    demonstrate_input_guardrails()
    demonstrate_output_guardrails()
    demonstrate_llm_guardrail_chain()
    demonstrate_rate_limiter()
    
    print("\n=== Integration Example ===")
    print("To integrate with your existing code:")
    print("1. Import: from guardrails import InputGuardrails, OutputGuardrails")
    print("2. Validate input before processing")
    print("3. Validate output before returning to user")
    print("4. See search_agent.py for complete integration example")