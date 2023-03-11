const Component = () => <div>
    {/* #v-ifdef DEV */}
    DEV
    {/* #v-endif */}
    {/* #v-ifdef DEV=true */}
    DEV=true
    {/* #v-endif */}
    {/* #v-ifdef !PROD!=true */}
    !PROD!=true
    {/* #v-endif */}
</div>;
